# Animal Welfare Donation App

## Current State
The app has donation campaigns with animal type filters including Dogs, Cats, Birds, Wildlife, Horses, Rabbits, Other.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- CampaignFilters: Update ANIMAL_TYPES to only show: All, Cows, Dogs, Cats, Birds
- Update hero/home text to reference these four specific animals

### Remove
- Animal type filter options: Wildlife, Horses, Rabbits, Other

## Implementation Plan
1. Update CampaignFilters.tsx to limit animal types to All, Cows, Dogs, Cats, Birds
2. Update Home.tsx hero subtitle to reference the four animals
