$('.weui_tab_bd').pullToRefresh();
$('.weui_tab_bd').on("pull-to-refresh", function() {
	console.log("pull");
	setTimeout(function() {
		$('.weui_tab_bd').pullToRefreshDone();
	},
	1000);
});