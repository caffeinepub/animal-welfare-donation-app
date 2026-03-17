import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldDonorProfile = {
    anonymous : Bool;
    imageUrl : Text;
    nickname : Text;
    totalDonated : Nat;
    recurringDonationAmount : Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldDonorProfile>;
    mobileNumbers : Map.Map<Principal, Text>;
  };

  type NewDonorProfile = {
    anonymous : Bool;
    imageUrl : Text;
    nickname : Text;
    mobileNumber : Text;
    totalDonated : Nat;
    recurringDonationAmount : Nat;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewDonorProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newProfiles = old.userProfiles.map<Principal, OldDonorProfile, NewDonorProfile>(
      func(p, oldProfile) {
        { oldProfile with mobileNumber = getMobileNumber(old.mobileNumbers, p : Principal) };
      }
    );
    { userProfiles = newProfiles };
  };

  func getMobileNumber(mobileNumbers : Map.Map<Principal, Text>, principal : Principal) : Text {
    switch (mobileNumbers.get(principal)) {
      case (null) { "" };
      case (?number) { number };
    };
  };
};
