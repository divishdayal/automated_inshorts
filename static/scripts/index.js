var sb = null;

function getData(){
    $.getJSON('/get_stories',function(data){
        $.each(data.stories, function(i,data){
        	var content = '';
			content += "<div class='card-panel grey lighten-5 z-depth-1'>";
			content +=      "<div class='row valign-wrapper card-content'>";
			content +=	        "<div class='col s12'>";
			content +=	         	"<span class='black-text'>";
			content +=	            	data.content;
			content +=	            "</span>";
			content +=	        "</div>";
			content +=      "</div>";
			content +=      "<span class='date-log'><i>"+ data.created_on +"</i></span>";
			content += "</div>";
            $(content).appendTo('#stories');
        });
    });
    sb.update();  
}

$(document).ready(function(){
	sb = ScrollBars();

	getData();
	
	// Refresh every 15 mins
	setInterval(function(){
		getData();
	}, 900000);
});

function ScrollBars(){
	this.containers = document.getElementsByClassName('stories-col');
	//Start
	$.each(this.containers, function(index, container){
		Ps.initialize(container);
	});
	//Update
	this.update = function(){
		$.each(this.containers, function(index, container){
			Ps.update(container);
		});
	}
}