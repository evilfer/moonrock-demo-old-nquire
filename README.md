moonrock-demo-old-nquire
========================


Modules of previous nQuire version, with changes and new modules to support the 
Moonrock demonstators.

Changes:

-----------------
09-09-2012

- Added libraries folder to source code.
- Added qTip module and library.
- Added icon to sample/snapshots images to show they can be opened.
- Added measure info tooltips.
- Fixed problem with styles of sorting of data table.
- Fixed numeric histograms.

-----------------
08-09-2012

- Added filter by view to snapshot search (not functional).
- Improved search form presentation.

-----------------
07-09-2012

- Snapshots can be edited after creation.
- Completed sample/snapshot dialog menu.
- Sample/snapshot code refactored in jquery plugin style.
- Fixed bugs with color picker movement and zooming.

-----------------
06-09-2012

- Added all rock colors (115).
- Completed snapshot search (except search by area).
- Fixed bug that kept sample/snapshot dialogs on the bottom.
- Fixed bug that kept new snapshot dialog under sample/snapshot dialogs.
- Fixed bug that prevented sample/snapshot scroll bar from reappearing correctly.

-----------------
05-09-2012

- New color picker working (only 24 colors).
- Fixed bugs in sample/snapshot browser.

-----------------
04-09-2012

- Texts improved.
- Started replacing color picker.

-----------------
03-09-2012

- Fixed bug: phases were not ordered by weight.
- Only teachers can change measure selection.
- Corrected texts (partially done).
- Added open VM icon.
- Added map and source for Sample content type.

-----------------
02-09-2012

- Fixed sample/snapshot dialog.
- Improved Sort my data.
- Fixed My result presentations.

-----------------
01-09-2012

- Changed VM dialog.
- Improved sample/snapshot search.

-----------------
30-08-2012

- Changed pi_result_presentations interface
- Added support for histograms in pi_chart
- pChart library supports displaying series names over bars (for histogram chart creation).
- Bugs:
  + Saving result presentations doesn't work.

-----------------
29-08-2012

- Bugs fixed:
  + Several dialogs would appear for the same snapshot/sample.
  + Snapshot search would result in duplicate items.
  + Snapshots created by others could be selected.

-----------------
27-08-2012

- Updated share findings activities: 
  + Modules 'moonrock_share_findings' and 'moonrock_review_findings' created.
  + Modules 'moonrock_share_notes' and 'moonrock_review_notes' removed.


-----------------
25-08-2012

- By default, "moonrock see samples" activity won't show snapshot search.
- Fixed a bug about creation of measures.
- Added sample info in new snapshot dialog

-----------------
24-08-2012

- Fixed snapshot module bug: didn't store notes in DB.
- Add data activity working correctly.
- Newly created snapshots are shown in activity view, if they match user search.

-----------------
23-08-2012

- Sample/snapshot selection partially working.
- Some code rafactoring.
- Improved search forms (moves to dialogs).
- Replaced cluetip by jquery.dialog.
- Added qtip plugin.

-----------------
22-08-2012

- Separated snapshot and sample search.
- Better integration in data forms.
- Fixed snapshot validation and creation.

Bug:
- Select samples/snapshots not working.



-----------------
20-08-2012

- Only own snapshots can be selected.
- Sample dialogs show title of sample and dialog.
- Fixed creation and validation of new snapshots.
- Updated pChart library to 2.1.3
- Fixed color selection (updated to new nquire hooks).
- nQuire measures can define color values, which are used to create the graph (see doc/nquire-hooks.txt).
- Graph includes color.


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

