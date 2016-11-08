init();

//初始化
function init() {
	//初始化下拉刷新组件
	$("#tab_kt, #tab_ws, #tab_cw, #tab_yt, #tab_zs, #tab_gj").pullToRefresh().on("pull-to-refresh",
		function() {
			var self = this;
			console.log(self.id);
			setTimeout(function() {
				loadLists(); //加载列表内容
				$(self).pullToRefreshDone(); //重置下拉刷新
			},
		1000); //模拟延迟
		});
	//初始化时加载列表内容
	loadLists();
}

// 初始化剪贴板，每次更新列表需要重新初始化
function initClipboard() {
	console.log('initClipboard');
	ZeroClipboard.destroy();
	ZeroClipboard.config({swfPath:"./js/ZeroClipboard/ZeroClipboard.swf"});
	//复制链接
	var linkClipboard = new ZeroClipboard($('.d-cplink'));
	linkClipboard.on('ready', function(event) {
		console.log( 'initClipboard ready' );
		linkClipboard.on('copy', function(event) {
			var link = $('#cplink_'+$(event.target).attr('data')).attr('href');
			event.clipboardData.setData('text/plain', link);
		});
		linkClipboard.on('aftercopy', function(event) {
			console.log(event.data['text/plain']);
			$.toast("链接复制成功<br>打开浏览器查看");
		});
	});
	linkClipboard.on( 'error', function(event) {
		console.log('initClipboard error: "' + event.name + '": ' + event.message);
		ZeroClipboard.destroy();
	});
	//复制淘口令
	var tokenClipboard = new ZeroClipboard($('.d-cptoken'));
	tokenClipboard.on('ready', function(event) {
		tokenClipboard.on('copy', function(event) {
			var title = $('#cptitle_'+$(event.target).attr('data')).text();
			var token = $('#cptoken_'+$(event.target).attr('data')).text();
			var price = $('#cpprice_'+$(event.target).attr('data')).text();
			var link = $('#cplink_'+$(event.target).attr('data')).attr('href');
			var msg = "复制这条信息，打开「手机淘宝」即可看到￥"+title+"【"+price+"】"+token+"￥"+link;
			event.clipboardData.setData('text/plain', msg);
		});
		tokenClipboard.on('aftercopy', function(event) {
			console.log(event.data['text/plain']);
			$.toast("淘口令复制成功<br>请打开手机淘宝");
		});
	});
	tokenClipboard.on( 'error', function(event) {
		console.log('initClipboard error: "' + event.name + '": ' + event.message);
		ZeroClipboard.destroy();
	});
}

//加载列表内容
function loadLists() {
	$.ajax({
		type: 'GET',
		url: 'json/goods.json?t='+(new Date().getTime()), //加上时间戳避免读取缓存
		dataType: 'json',
		success: function(data) {
			var result = '';
			var type = '';
			var title = '';
			var link = '';
			var price = '';
			var token = '';
			var pic = '';
			$('.lists').html(''); //清空lists
			for (var i = 0; i < data.lists.length; i++) {
				type = data.lists[i].type;
				title = data.lists[i].title;
				link = data.lists[i].link;
				price = data.lists[i].price;
				token = data.lists[i].token;
				pic = data.lists[i].pic;
				result
				= '<div class="list-item"><div class="p"><a href="'+link+'"><img class="p-pic" src="'+pic+'"></a></div>'
				+ '<div class="d"><a id="cplink_'+type+i+'" href="'+link+'"><h3 id="cptitle_'+type+i+'" class="d-title">'+title+'</h3></a><div class="d-buyinfo">'
				+ '<p id="cpprice_'+type+i+'" class="d-price">¥'+price+'</p><p class="d-tip">淘口令</p><p id="cptoken_'+type+i+'" class="d-token">'+token+'</p></div>'
				+ '<div class="d-button">'
				+ '<p class="d-cplink" data="'+type+i+'"><a href="#" class="weui_btn weui_btn_mini weui_btn_primary">淘宝链接</a></p>'
				+ '<p class="d-cptoken" data="'+type+i+'"><a href="#" class="weui_btn weui_btn_mini weui_btn_warn">淘宝口令</a></p>'
				+ '</div></div></div>';
				$('#tab_'+type+' .lists').append(result); //把结果更新到lists
			}
			initClipboard();//初始化剪贴板
		},
		error: function(xhr, type) {
			var result = '';
			$('.lists').html(''); //清空lists
			result
			= '<div class="list-item"><div class="p"><a href="#"><img class="p-pic" src=""></a></div>'
			+ '<div class="d"><a id="cplink_0" href="#"><h3 id="cptitle_0" class="d-title">数据加载失败，请重试</h3></a><div class="d-buyinfo">'
			+ '<p id="cpprice_0" class="d-price">¥0.0</p><p class="d-tip">淘口令</p><p id="cptoken_0" class="d-token">$000000$</p></div>'
			+ '<div class="d-button">'
			+ '<p class="d-cplink"><a href="#" class="weui_btn weui_btn_mini weui_btn_primary">淘宝链接</a></p>'
			+ '<p class="d-cptoken"><a href="#" class="weui_btn weui_btn_mini weui_btn_warn">淘宝口令</a></p>'
			+ '</div></div></div>';
			$('.lists').append(result); //把结果更新到lists
		}
	});
}