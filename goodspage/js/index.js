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
				+ '<div class="d"><a id="cplink_'+type+i+'" href="'+link+'"><h3 class="d-title">'+title+'</h3></a><div class="d-buyinfo">'
				+ '<p class="d-price">¥'+price+'</p><p class="d-tip">淘口令</p><p id="cptoken_'+type+i+'" class="d-token">'+token+'</p></div>'
				+ '<div class="d-button">'
				+ '<p class="d-cplink" onclick="copyLink(\''+type+i+'\');"><a href="#" class="weui_btn weui_btn_mini weui_btn_primary">复制链接</a></p>'
				+ '<p class="d-cptoken" onclick="copyToken(\''+type+i+'\');"><a href="#" class="weui_btn weui_btn_mini weui_btn_warn">复制淘口令</a></p>'
				+ '</div></div></div>';
				$('#tab_'+type+' .lists').append(result); //把结果更新到lists
			}
		},
		error: function(xhr, type) {
			var result = '';
			$('.lists').html(''); //清空lists
			result
			= '<div class="list-item"><div class="p"><a href="#"><img class="p-pic" src=""></a></div>'
			+ '<div class="d"><a href="#"><h3 class="d-title">数据加载失败，请重试</h3></a><div class="d-buyinfo">'
			+ '<p class="d-price">¥0.0</p><p class="d-tip">淘口令</p><p class="d-token">$000000$</p></div>'
			+ '<div class="d-button">'
			+ '<p class="d-cplink"><a href="#" class="weui_btn weui_btn_mini weui_btn_primary">复制链接</a></p>'
			+ '<p class="d-cptoken"><a href="#" class="weui_btn weui_btn_mini weui_btn_warn">复制淘口令</a></p>'
			+ '</div></div></div>';
			$('.lists').append(result); //把结果更新到lists
		}
	});
}

//复制链接
//暂未实现
function copyLink(id) {
	console.log("链接："+$('#cplink_'+id).attr("href"));
	alert("链接："+$('#cplink_'+id).attr("href"));
}

//复制淘口令
//暂未实现
function copyToken(id) {
	console.log("淘口令："+$('#cptoken_'+id).text());
	alert("淘口令："+$('#cptoken_'+id).text());
}