function replaceAll(strOrg,strFind,strReplace)
{
 var index = 0;
 while(strOrg.indexOf(strFind,index) != -1){
  strOrg = strOrg.replace(strFind,strReplace);
  index = strOrg.indexOf(strFind,index);
 }
 return strOrg
} 

function api_sync_post(url, data, callback, type ) 
{
	if ( $.isFunction( data ) ) {
		callback = data;
		data = {};
	}

	return $.ajax({
		async: false,
		type: "POST",
		url: url,
		data: data,
		success: callback,
		dataType: type
	});
}
	
function sh_api(options, datas)
{
	
	var opts = $.extend({},{
			opurl: '/op/api',
			sync: 'sync',
			event: function(event, datas){
				switch(event)
				{
					case 'error':
    					alert('Error(' + datas.code + ') : ' + datas.msg);
						break;

					case 'success':
						alert("Api Success");
					break;
				}
			}
		},
		options
	);

	if(opts.sync == 'sync')
	{
		api_sync_post(opts.opurl, datas, postrespone);
	}
	else 
	{
		// async
		$.post(opts.opurl, datas, postrespone);
	}
	
	function postrespone(xmlData, textStatus){
		var xml;
		if (jQuery.browser.msie) {
    		xml = new ActiveXObject( 'Microsoft.XMLDOM');
    		xml.async = false;
    		xml.loadXML(xmlData);
		} else {
    		xml = xmlData;
		} 
	    
	    if(textStatus == 'success')
	    {
    		var $xml = $(xml);
    		
	    	var dataxml= $xml.find('data');
	    		
	    	var data = {};
			if(dataxml.length > 0)
			{
				data = eval('(' + dataxml.text() + ')');
			}
    		
			var $r = $xml.find('response');

			var r = {
	    		'code': $r.attr('code'),
	    		'msg' : $r.text(),
	    		'input': datas,
	    		'data': data
	    	};

	    	if(r.code !=0)
	    	{
    			opts.event('error', r);
	    		return this;
	    	}
	    	
			opts.event('success', r);
	    }
	    else
	    {
			var r = {
	    		code: -1,
	    		msg : 'ajax fail'
	    	};
			opts.event('error', r);
	    }
   	};
}
