

(function($) {
  var methods = {
    init : function() {
      this.vmManager('updateTitle');      
      
      this.vmManager('enableButton', 'new', true);
      this.vmManager('enableButton', 'edit', parseInt(this.attr('own-snapshot')));
      this.vmManager('enableButton', 'center', false);
      this.vmManager('enableButton', 'search', true);
    
      var self = this;

      this.find(".moonrock-sample-dlg-menu-new").click(function() {
        if ($(this).hasClass("enabled")) {
          MoonrockSampleDialog.openNewSnapshotForm(self);
        }
      });
      this.find(".moonrock-sample-dlg-menu-edit").click(function() {
        if ($(this).hasClass("enabled")) {
          MoonrockSampleDialog.openEditSnapshotForm(self);
        }
      });
    },
    updateTitle: function() {
      var sampleName = this.attr("sample_name");
      var snapshotName = this.attr("snapshot_name");
      
      this.vmManager('getDlg').vmDialog('setTitle', snapshotName ? snapshotName + ' (' + sampleName + ')': sampleName);
      return this;
    },
    getDlg: function() {
      return this.parents('.vm-dlg-dialog');
    },
    enableButton: function(button, enabled) {
      if (enabled) {
        this.find(".moonrock-sample-dlg-menu-" + button).addClass("enabled");
      } else {
        this.find(".moonrock-sample-dlg-menu-" + button).removeClass("enabled");
      }
      return this;
    },
    
    setSnapshot : function(snapshot) {
      this.attr("snapshot", snapshot.nid).attr("snapshot_name", snapshot.title).attr('own-snapshot', 1);
      this.find('.moonrock-sample-snapshot-notes').html(snapshot.notes);
      
      this.vmManager('enableButton', 'edit', true);
      this.vmManager('getDlg').vmDialog('setItemId', snapshot.nid)
      this.vmManager('updateTitle');
    },
    sampleInfo: function() {
      return {
        id: this.attr("sample"),
        name: this.attr("sample_name")
      };
    },
    snapshotInfo: function() {
      return {
        id: this.attr("snapshot"),
        name: this.attr("snapshot_name"),
        notes: this.find('.moonrock-sample-snapshot-notes').html()
      };
    }
  };

  $.fn.vmManager = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      console.log('Method ' + method + ' does not exist on jQuery.vmManager');
    }
  };
})(jQuery);

