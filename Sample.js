//***********************************
//function to send a productcolorid to web service
//returns information on all product colors linked to product containing this color
//information retrieved is used to determine the need to split colors into separate products
//***********************************
function showRelatedItemsInfo(pcid) {
    $.ajax({//send json to server
        type: "POST",
        url: "MyProcessPage.aspx/showRelatedItemsInfo",
        data: JSON.stringify({ productColorID: pcid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg) {//on success post message
            var msg = $.parseJSON(msg.d); //get .net json object return
            if (msg.successful > 0) { //the request succeeded
                var itemList = msg.itemList; //list of colors
                $('#splitColorItems').html(''); //clear popup in case it was previously populated
                $(itemList).each(function(index, element) {
					if (pcid != element.productColorID) {//check to see if this is the original product color we sent
                        $("#splitColorItems").append(  
						   $('<div/>').addClass('pcidCheck').append(
							  $('<input/>', {
								  id: 'chkSplit' + element.productColorID,
								  name: 'addPCIDtoSplit',
								  type: 'checkbox'
							  }).addClass('checkboxFloat') //appends a new checkbox input as a choice of items to split
						  ).append(
							  $('<div/>', {
								  text: element.colorName + " "
							  }).addClass('pcIDDescSplit') //appends a div containing the name of the color
						  )
					  	)
                    }
                });
                $('#color2SplitName').text($('tr[id="pcid' + pcid + '"]').find('td.colorCell').text());
                $('#productColorID2Split').text(pcid);
                $('#splitColorConfirmPop, #overlay').show();
                $('#overlay, #splitColorCancel').off('click').on('click', function(e) {
                    $('#splitColorConfirmPop, #overlay').hide();
                });
            } else { //ajax didn't fail, but for some reason the information wasn't retrieved
                $('#FailureMessage').append('Status: ' + msg.message).attr('class', 'error');
                displayFailure(); //display failure message;
            }
            hideUpdatingItem();
        },
	//on ajax error
	error: function(request, status, error) {
            $('#FailureMessage').append('Status: ' + status.toString() + '.  ' + error.toString() + request.responseText).attr('class', 'error');
            displayFailure(); //display failure message function;
            hideProcessingItem(); //hide processing item message
        }
    });
    displayProcessingItem(); //show processing item message
}
