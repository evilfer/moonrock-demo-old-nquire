-- SUMMARY --
qTip is another tooltip module for Drupal. By using a simple input filter in your
code you can have a stylish tooltip in just seconds.


-- REQUIREMENTS --
You must download and install the qTip library from
http://craigsworks.com/projects/qtip/download/
This library is licensed under MIT and therefore is not allowed to be hosted on drupal.org

Make sure that you select the 'Production' option. You may download the development
option as well if you would like to check out the code and select to use it on the
admin settings page (under Advanced options), but it is recommended that you use the
compressed 'Production' version of the library on production (live) sites.

Place the extracted contents of the library into /sites/all/libraries/qtip
NOTE: You may have to create the libraries directory
  You should end up with something like this:
    /sites/all/libraries
      /qtip (You will need to create this directory)
        jquery.qtip-1.0.0-rc3.min.js
        REQUIREMENTS
        INSTALL
        LICENSE


-- INSTALLATION --
* Install as usual (see dependency above), see http://drupal.org/node/70151 for further information.


-- CONFIGURATION --
* Once installed, go to admin/settings/qtip
    * Select how you would like your qTips to display. Save.
* If you want to use simple tooltips via a filter:
    * Go to admin/settings/filters
        * Click 'configure' on the input filter that you would like to add qTip to
          NOTE: For input filters that have 'HTML filter' enabled (like Filtered HTML), qTip MUST be weighted heavier than HTML filter
            This should be default, but it would be a good idea to check.
    * Save and repeat for as many input filters as you would like.
    * On a node page enter the filter with the following format:
      [qtip:Name of link (target) text|Text to appear in tooltip]
        The filter MUST start with '[qtip:' (no quotes)
        The visible text that will always show on the node page and will be used as a link to
        the tooltip comes next, followed by | (pipe)
        Finally, the text you would like to appear in the tooltip is last, followed by ']' (no quotes)
* To use more advanced (including HTML markup) tooltips:
  NOTE: For input filters that have 'HTML filter' enabled (like Filtered HTML), this option will not work!
    * Use the following structure on a node page
        * <span class="qtip-link">
            <div class="qtip-header">Tooltip Heading (optional)</div>
            <div class="qtip-tooltip">Tooltip content</div>
            Link text to tooltip
          </span>
        * You do not have to specify a heading.
        * The tooltip content area can contain any HTML markup.
* Below is a template of each tooltip HTML structure. Use this for custom CSS styling
    FROM: http://craigsworks.com/projects/qtip/docs/#structure
    <div class="qtip qtip-stylename">
       <div class="qtip-tip" rel="cornerValue"></div>
       <div class="qtip-wrapper">
          <div class="qtip-borderTop"></div> // Only present when using rounded corners
          <div class="qtip-contentWrapper">
             <div class="qtip-title"> // All CSS styles...
                <div class="qtip-button"></div> // ...are usually applied...
             </div>
             <div class="qtip-content"></div> // ...to these three elements!
          </div>
          <div class="qtip-borderBottom"></div> // Only present when using rounded corners
       </div>
    </div>
    NOTE: You may have to use !important with your CSS rules as some of the rules
    are set inline by the qTip library.
    qtip-button is not yet implemented in this module


-- MAINTAINERS --
Current maintainers:
* Jacob Neher (bocaj) - http://drupal.org/user/582042


-- SPECIAL THANKS --
To Craig Thompson, creator of the qTip jQuery plugin!
http://craigsworks.com