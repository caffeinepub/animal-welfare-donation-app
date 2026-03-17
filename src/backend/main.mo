import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type UserProfile = {
    anonymous : Bool;
    imageUrl : Text;
    nickname : Text;
  };

  public type DonorProfile = {
    anonymous : Bool;
    imageUrl : Text;
    nickname : Text;
    totalDonated : Nat;
    recurringDonationAmount : Nat;
  };

  public type AnimalCampaign = {
    id : Nat;
    title : Text;
    description : Text;
    animalType : Text;
    imageUrl : Text;
    fundraisingGoal : Nat;
    amountRaised : Nat;
    startDate : Time.Time;
    endDate : Time.Time;
    isActive : Bool;
  };

  public type Donation = {
    donor : Principal;
    donorName : Text;
    campaignId : Nat;
    amount : Nat;
    timestamp : Time.Time;
    isRecurring : Bool;
    referenceId : Text;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, DonorProfile>();
  let activeCampaigns = List.empty<AnimalCampaign>();
  var campaignIdCounter = 0;
  let donations = List.empty<Donation>();

  module AnimalCampaignModule {
    public func compareByAmountRaised(campaign1 : AnimalCampaign, campaign2 : AnimalCampaign) : Order.Order {
      Nat.compare(campaign1.amountRaised, campaign2.amountRaised);
    };
  };

  // ---- Required profile functions per instructions ----

  public query ({ caller }) func getCallerUserProfile() : async ?DonorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : DonorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?DonorProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // ---- Donor Registration and Profile Management ----

  public shared ({ caller }) func registerDonor(profile : DonorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as donors");
    };
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("Donor already exists");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getDonorProfile() : async ?DonorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their donor profile");
    };
    userProfiles.get(caller);
  };

  // ---- Campaign Management (admin-only) ----

  public shared ({ caller }) func createCampaign(
    title : Text,
    description : Text,
    animalType : Text,
    imageUrl : Text,
    fundraisingGoal : Nat,
    startDate : Time.Time,
    endDate : Time.Time,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create campaigns");
    };
    let id = campaignIdCounter;
    campaignIdCounter += 1;
    let campaign : AnimalCampaign = {
      id;
      title;
      description;
      animalType;
      imageUrl;
      fundraisingGoal;
      amountRaised = 0;
      startDate;
      endDate;
      isActive = true;
    };
    activeCampaigns.add(campaign);
    id;
  };

  public shared ({ caller }) func deactivateCampaign(campaignId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can deactivate campaigns");
    };
    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { { c with isActive = false } } else { c }
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());
  };

  // ---- Campaign Browsing (public, no auth required) ----

  public query func getActiveCampaigns() : async [AnimalCampaign] {
    let all = activeCampaigns.toArray();
    let onlyActive = all.filter(func(c) { c.isActive });
    onlyActive.sort(AnimalCampaignModule.compareByAmountRaised);
  };

  public query func getAllCampaigns() : async [AnimalCampaign] {
    activeCampaigns.toArray().sort(AnimalCampaignModule.compareByAmountRaised);
  };

  public query func getCampaign(campaignId : Nat) : async ?AnimalCampaign {
    activeCampaigns.find(func(c) { c.id == campaignId });
  };

  // ---- Donation Submission ----

  public shared ({ caller }) func submitDonation(campaignId : Nat, amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can make donations");
    };

    let campaignOpt = activeCampaigns.find(func(camp) { camp.id == campaignId and camp.isActive });
    let campaign = switch (campaignOpt) {
      case (?value) { value };
      case (null) { Runtime.trap("Campaign not found or inactive") };
    };

    let donor = switch (userProfiles.get(caller)) {
      case (?d) { d };
      case (null) { Runtime.trap("Donor profile not found. Please register first.") };
    };

    let now = Time.now();
    let referenceId = campaignId.toText() # "-" # caller.toText() # "-" # Int.toText(now);

    let donation : Donation = {
      donor = caller;
      donorName = donor.nickname;
      campaignId;
      amount;
      timestamp = now;
      isRecurring = false;
      referenceId;
    };

    donations.add(donation);

    // Update the campaign with the new amount raised
    let updatedCampaign : AnimalCampaign = {
      campaign with amountRaised = campaign.amountRaised + amount
    };

    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { updatedCampaign } else { c }
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());

    // Update donor's total donated amount
    let updatedDonor : DonorProfile = {
      donor with totalDonated = donor.totalDonated + amount
    };
    userProfiles.add(caller, updatedDonor);

    referenceId;
  };

  public shared ({ caller }) func submitRecurringDonation(campaignId : Nat, amount : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can make recurring donations");
    };

    let campaignOpt = activeCampaigns.find(func(camp) { camp.id == campaignId and camp.isActive });
    let campaign = switch (campaignOpt) {
      case (?value) { value };
      case (null) { Runtime.trap("Campaign not found or inactive") };
    };

    let donor = switch (userProfiles.get(caller)) {
      case (?d) { d };
      case (null) { Runtime.trap("Donor profile not found. Please register first.") };
    };

    let now = Time.now();
    let referenceId = "REC-" # campaignId.toText() # "-" # caller.toText() # "-" # Int.toText(now);

    let donation : Donation = {
      donor = caller;
      donorName = donor.nickname;
      campaignId;
      amount;
      timestamp = now;
      isRecurring = true;
      referenceId;
    };

    donations.add(donation);

    // Update the campaign with the new amount raised
    let updatedCampaign : AnimalCampaign = {
      campaign with amountRaised = campaign.amountRaised + amount
    };

    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { updatedCampaign } else { c }
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());

    // Update donor's total donated amount and recurring amount
    let updatedDonor : DonorProfile = {
      donor with
      totalDonated = donor.totalDonated + amount;
      recurringDonationAmount = amount;
    };
    userProfiles.add(caller, updatedDonor);

    referenceId;
  };

  public shared ({ caller }) func cancelRecurringDonation() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can cancel recurring donations");
    };
    let donor = switch (userProfiles.get(caller)) {
      case (?d) { d };
      case (null) { Runtime.trap("Donor profile not found") };
    };
    let updatedDonor : DonorProfile = {
      donor with recurringDonationAmount = 0
    };
    userProfiles.add(caller, updatedDonor);
  };

  // ---- Donation History ----

  public query ({ caller }) func getDonationHistory() : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view donation history");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Donor profile not found") };
      case (?_) {
        let filteredDonations = donations.filter(
          func(d) { d.donor == caller }
        );
        filteredDonations.toArray();
      };
    };
  };

  public query ({ caller }) func getRecurringDonations() : async [Donation] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view recurring donations");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Donor profile not found") };
      case (?_) {
        let filtered = donations.filter(
          func(d) { d.donor == caller and d.isRecurring }
        );
        filtered.toArray();
      };
    };
  };
};
