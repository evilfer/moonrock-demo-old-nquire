$(function() {

	function messageEvent(event) {
		alert("(" + event.data.x + ", " + event.data.y + ")");
		console.log(event.data);
	}

	window.addEventListener('message', messageEvent, false);

	$("#callappbutton").click(function() {
		AppLink.postMessage("click", null);
	});

	$("#detachbutton").click(function() {
		AppLink.detachApp();
	});

	$("#closebutton").click(function() {
		AppLink.closeApp();
	});

});

var AppLink = {
	remotewindow : null,

	getRemoteWindow : function() {
		if (this.remotewindow == null) {
			this.remotewindow = document.getElementById('embeddedapp').contentWindow;
		}
		return this.remotewindow;
	},

	postMessage : function(op, data) {
		var w = this.getRemoteWindow();
		w.postMessage({
			op : op,
			data : data
		}, w.location.href);
	},

	detachApp : function() {
		this.remotewindow = window.open($('#embeddedapp').attr('src'),
				'mywindow', 'width=400,height=200');
	},
	
	closeApp: function() {
		this.remotewindow.close();
		this.remotewindow = null;
	}
};