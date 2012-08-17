moonrock-demo-old-nquire
========================

Modules of previous nQuire version, with changes and new modules to support the 
Moonrock demonstators.

Changes:

-----------------
17-08-2012

- Snapshots can be created and searched for.
- Snapshot selection works on add data activities.

Bugs:
- Data is not saved correctly.
- Sample and Snapshots measures are not validated when creating data.

-----------------
14-08-2012

- Added collapsible search box to Rock samples.
- Fixed bug: Javascript error if either sample search or selection not active.

-----------------
13-08-2012

- Added support for Moonrock sample searches.
- Integration between search and selection of samples in add data activities.

-----------------
10-08-2012

- Removed moonrock_data_input module, not needed anymore.
- Added moonrock_sample type, included as available measure content type.
- Added moonrock_sample custom form theme.
- Fix bug in color picker, which would prevent the picker to work without a default value.

-----------------
09-08-2012

- Updated AHAH helper to 2.2.
- Fixed color picker: default colour is selected.
- Fixed moonrock_share_notes, it behaves now as pi_wiki_notes, having only one activity and one single node per user.
- Added moonrock_review_notes, which allows users to search and read notes (content of type moonrock_share_notes) created by other users.
------------------

