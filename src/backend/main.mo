import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type DonorProfile = {
    anonymous : Bool;
    imageUrl : Text;
    nickname : Text;
    mobileNumber : Text;
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

  // Auto-register authenticated callers as #user if not already registered
  func ensureUserRole(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers are not allowed");
    };
    if (accessControlState.userRoles.get(caller) == null) {
      accessControlState.userRoles.add(caller, #user);
    };
  };

  // Seed campaigns
  let seedStart : Time.Time = 1735689600_000_000_000;
  let seedEnd : Time.Time = 1767225600_000_000_000;

  let seedCampaigns : [AnimalCampaign] = [
    {
      id = 0;
      title = "Gau Seva - Daily Cow Feeding";
      description = "Help us feed abandoned and stray cows every day with nutritious fodder, green grass, and clean water. Your donation ensures these gentle creatures are well-fed and cared for.";
      animalType = "Cow";
      imageUrl = "";
      fundraisingGoal = 50000;
      amountRaised = 12000;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
    {
      id = 1;
      title = "Cow feeding on occasion of Padwa";
      description = "Celebrate Padwa (Pratipada) by contributing to the sacred tradition of Gau Seva. On this auspicious day, help us feed cows with special prasad, jaggery, and fodder as a mark of devotion and gratitude. Your seva brings blessings to your family.";
      animalType = "Cow";
      imageUrl = "";
      fundraisingGoal = 31000;
      amountRaised = 0;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
    {
      id = 5;
      title = "Gau Seva Padva";
      description = "Gau Seva Padva is a sacred campaign to celebrate the auspicious occasion of Padva by serving and feeding cows. Join us in honouring our Gau Mata with nutritious prasad, green fodder, jaggery, and love. Your donation on this holy day brings immense blessings and fulfils the tradition of Gau Puja.";
      animalType = "Cow";
      imageUrl = "";
      fundraisingGoal = 51000;
      amountRaised = 0;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
    {
      id = 2;
      title = "Street Dog Feeding Drive";
      description = "Thousands of street dogs go hungry every day. Join our feeding drive to provide nutritious meals to stray dogs in your city. Every contribution helps us reach more dogs and reduce their suffering.";
      animalType = "Dog";
      imageUrl = "";
      fundraisingGoal = 25000;
      amountRaised = 8500;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
    {
      id = 3;
      title = "Stray Cat Care & Feeding";
      description = "Help us provide daily meals and basic medical care for stray and abandoned cats. Your donation supports our volunteers who tirelessly care for these gentle animals every day.";
      animalType = "Cat";
      imageUrl = "";
      fundraisingGoal = 15000;
      amountRaised = 4200;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
    {
      id = 4;
      title = "Bird Feeding & Water Station";
      description = "Set up bird feeding stations and clean water bowls across the city, especially during summer. Help sparrows, pigeons, crows, and other birds stay nourished and hydrated through the harsh seasons.";
      animalType = "Bird";
      imageUrl = "";
      fundraisingGoal = 10000;
      amountRaised = 3100;
      startDate = seedStart;
      endDate = seedEnd;
      isActive = true;
    },
  ];

  for (campaign in seedCampaigns.vals()) {
    activeCampaigns.add(campaign);
  };
  campaignIdCounter := 6;

  module AnimalCampaignModule {
    public func compareByAmountRaised(campaign1 : AnimalCampaign, campaign2 : AnimalCampaign) : Order.Order {
      Nat.compare(campaign1.amountRaised, campaign2.amountRaised);
    };
  };

  // Returns null for new/unregistered users -- no trap for anonymous
  // This function allows any caller including anonymous/guests
  public query ({ caller }) func getCallerUserProfile() : async ?DonorProfile {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile };
    };
  };

  // Also used as registerDonor (auto-registers caller as #user on first call)
  public shared ({ caller }) func saveCallerUserProfile(profile : DonorProfile) : async () {
    ensureUserRole(caller);
    userProfiles.add(caller, profile);
  };

  // Admin or self only
  public query ({ caller }) func getUserProfile(user : Principal) : async ?DonorProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { ?profile };
    };
  };

  // Admin only
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

  // Admin only
  public shared ({ caller }) func deactivateCampaign(campaignId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can deactivate campaigns");
    };
    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { { c with isActive = false } } else { c };
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());
  };

  // Public - accessible to all including guests
  public query func getActiveCampaigns() : async [AnimalCampaign] {
    let all = activeCampaigns.toArray();
    let onlyActive = all.filter(func(c) { c.isActive });
    onlyActive.sort(AnimalCampaignModule.compareByAmountRaised);
  };

  // Public - accessible to all including guests
  public query func getAllCampaigns() : async [AnimalCampaign] {
    activeCampaigns.toArray().sort(AnimalCampaignModule.compareByAmountRaised);
  };

  // Public - accessible to all including guests
  public query func getCampaign(campaignId : Nat) : async ?AnimalCampaign {
    activeCampaigns.find(func(c) { c.id == campaignId });
  };

  // Requires registered donor (user role)
  public shared ({ caller }) func submitDonation(campaignId : Nat, amount : Nat) : async Text {
    ensureUserRole(caller);

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
    let referenceId = campaignId.toText() # "-" # caller.toText() # "-" # now.toText();

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

    let updatedCampaign : AnimalCampaign = {
      campaign with amountRaised = campaign.amountRaised + amount;
    };

    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { updatedCampaign } else { c };
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());

    let updatedDonor : DonorProfile = {
      donor with totalDonated = donor.totalDonated + amount;
    };
    userProfiles.add(caller, updatedDonor);

    referenceId;
  };

  // Requires registered donor (user role)
  public shared ({ caller }) func submitRecurringDonation(campaignId : Nat, amount : Nat) : async Text {
    ensureUserRole(caller);

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
    let referenceId = "REC-" # campaignId.toText() # "-" # caller.toText() # "-" # now.toText();

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

    let updatedCampaign : AnimalCampaign = {
      campaign with amountRaised = campaign.amountRaised + amount;
    };

    let newCampaigns = activeCampaigns.map<AnimalCampaign, AnimalCampaign>(
      func(c) {
        if (c.id == campaignId) { updatedCampaign } else { c };
      }
    );
    activeCampaigns.clear();
    activeCampaigns.addAll(newCampaigns.values());

    let updatedDonor : DonorProfile = {
      donor with
      totalDonated = donor.totalDonated + amount;
      recurringDonationAmount = amount;
    };
    userProfiles.add(caller, updatedDonor);

    referenceId;
  };

  // Requires registered donor (user role)
  public shared ({ caller }) func cancelRecurringDonation() : async () {
    ensureUserRole(caller);
    let donor = switch (userProfiles.get(caller)) {
      case (?d) { d };
      case (null) { Runtime.trap("Donor profile not found") };
    };
    let updatedDonor : DonorProfile = {
      donor with recurringDonationAmount = 0;
    };
    userProfiles.add(caller, updatedDonor);
  };

  // Returns caller's donations - requires registered user
  public query ({ caller }) func getDonationHistory() : async [Donation] {
    // Allow any caller, but only return data if they have a profile
    // This allows guests to call but get empty array
    switch (userProfiles.get(caller)) {
      case (null) { [] };
      case (?_) {
        let filteredDonations = donations.filter(
          func(d) { d.donor == caller }
        );
        filteredDonations.toArray();
      };
    };
  };

  // Returns caller's recurring donations - requires registered user
  public query ({ caller }) func getRecurringDonations() : async [Donation] {
    // Allow any caller, but only return data if they have a profile
    // This allows guests to call but get empty array
    switch (userProfiles.get(caller)) {
      case (null) { [] };
      case (?_) {
        let filtered = donations.filter(
          func(d) { d.donor == caller and d.isRecurring }
        );
        filtered.toArray();
      };
    };
  };
};
