// 在 jing.fm 上
// 根据种类关键词搜索想听的歌曲

(function () {
	var timer;
	var startExecuteTime;
	var targetItems = [];

	var search = function (keywords, str) {
		var sws = keywords.split(' ');

		var okSws = sws.filter(function (sw) {
			return str.indexOf(sw) !== -1;
		});

		return !!okSws.length;
	}

	var now = function () {
		return +new Date;
	};

	var finder = function(keywords) {
	    $.ajax({
	        url: Core.API_VER + "/app/fetch_natural",
	        data: {
	            ps: 100
	        },
	        success: function(e) {
	            if (!e.success) {
	                return;
	            }

	            var items = e.result.items.filter(function(item) {
	                return search(keywords, item.sw);
	            });

	            if (!items.length) {
	            	timer = setTimeout(function () {
	            		finder(keywords);
	            	});
	                return;
	            }

	            var okItems = items.filter(function (item) {
	            	var sw = item.sw

	            	var tItems = targetItems.filter(function (tItem) {
	            		return tItem.sw === sw;
	            	});

	            	return !tItems.length;
	            });

	            targetItems = targetItems.concat(okItems);

	            var currentTime = now();
	            
	            if (targetItems.length >= 10 || (currentTime - startExecuteTime) / (1000 * 60) > 3) {
	            	clearTimeout(timer);
	            } else {
	            	timer = setTimeout(function () {
	            		finder(keywords);
	            	});
	            }

	            var t = "";

	            for (var r = 0; r < targetItems.length; ++r) {
	                t += '<div class="ntrlLng"><a href="#" class="ntlPlyCtl tkrsFlyEvent" data-fid="CmbtFlyBadge" data-span="' + targetItems[r].sw + '"></a>' + '<blockquote class="qtSch">' + targetItems[r].sw + "</blockquote>" + "</div>"
	            }

	            $("#ntrlLngTopCtn>.ntrlLngTop").html(t);
	        }
	    });
	};

	$('#ntrlLngBtn').on('click', function () {
		startExecuteTime = now();
		finder('程序 代码 命令');	
	});

})();
