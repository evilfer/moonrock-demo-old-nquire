No Colons
================================================================================
The No Colons module allows you to remove colons from form labels and other 
types of label text. There are two modes of operation: Remove all colons -or- 
Remove colons only if label text ends in the following punctuation: -%.,!?"'=+


Configuration
================================================================================
To configure this module, go to this page:
/admin/settings/no_colons


Compatibility
================================================================================
Currently No Colons works with the following:
- all drupal form input labels (including Node Add, site configuration pages, 
and the Search form)
- CCK fields (including field display labels, if an optional jQuery setting is 
enabled)
- Webform input labels
- Views field display labels (if an optional jQuery setting is enabled)

Works with Zen theme (http://drupal.org/project/zen).


CCK Field Displays Labels
================================================================================
If the "Use jQuery to remove colons from CCK field display labels" checkbox is 
checked on the settings page, colons will be removed from CCK field display 
labels, according to the Mode setting; the trailing &nbsp; character will also 
be removed from the label text. Alternatively, you can place a copy of 
modules/cck/theme/content-field.tpl.php into your theme and remove the colons 
from that template.


Views Field Display Labels
================================================================================
If the "Use jQuery to remove colons from Views field display labels" checkbox is 
checked on the settings page, colons will be removed from Views field display 
labels, according to the Mode setting; the trailing space characters will also 
be removed from the label text. Please note that this option will only work for 
built-in Views displays (Grid, List, and Unformatted). Alternatively, you can 
disable the field label(s) in the view and rewrite the field as follows: 
LABEL-TEXT [FIELD-TOKEN]. Another approach is to use a tpl.php specific to the 
view fields.


Credits
================================================================================
Maintained by Rian Callahan - http://riancallahan.com

Additional testing by Jason Loeffler (minorscience)