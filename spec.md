# GOSEVA PASHUPALAK

## Current State
The Motoko backend has `DonorProfile` with `mobileNumber: Text`, but the compiled Candid DID file is missing `mobileNumber`. This causes a Candid mismatch when saving profiles.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Regenerate backend so the Candid DID includes `mobileNumber` in `DonorProfile`

### Remove
- Nothing

## Implementation Plan
1. Regenerate Motoko backend with `mobileNumber` in `DonorProfile`
2. Update frontend to use regenerated types
