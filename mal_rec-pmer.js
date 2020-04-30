// ==UserScript==
// @name MAL ReviewReport PMer (created by Kineta; edited by AndyRayy) - Chrome
// @description Adds PM functionality, removal reason options, and episodes seen
// @version 1.6.8
// @updateURL https://www.dropbox.com/sh/w2slpk3kq6ca5xd/AADEGzOTQOmiW7SqhmBi7Euia/Review%20Mods/Chrome/mal_review_pmer.user.js?dl=1
// @downloadURL https://www.dropbox.com/sh/w2slpk3kq6ca5xd/AADEGzOTQOmiW7SqhmBi7Euia/Review%20Mods/Chrome/mal_review_pmer.user.js?dl=1
// @include http://myanimelist.net/administration.php?go=submissions&type=28*
// ==/UserScript==

var modname = document.getElementById('nav').innerHTML.match(/profile\/[0-9a-zA-Z-_]+/)[0].replace('profile/','');
var modtype = 'Review/Rec Moderator';
 
var box_width = '95'; // Default: 95
var box_height = '25'; // // Default: 25

// If you do NOT want the episodes/votes/date to show up, change this to false
var getInfo = true;

var index = 1; // can temporarily change to arbitrarily high value to test controller in getProfile
var animeLink = '';
var reviewID = '';
var isManga = false;

// Changes the message to be sent to the user based on the particular option selected
// To add a new message option, simply enter the following (refer to the messages already here for specifics/adding modname, etc):
//
// else if (pmtypeselect === 'HTML_OPTION_VALUE_HERE') {
//     document.getElementById('removal_PM').value = 'Your message here.';
// }
var stockMsgs = function() {
	var pmtypeselect = document.getElementById('whichStock').value;
	document.getElementById('edited').checked = (pmtypeselect === 'edit');

	// Enter your stock PM's in each little section below
	if (pmtypeselect === 'preview') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your previews of an ongoing anime series has been removed. \n\nAs stated [url=http://myanimelist.net/forum/?topicid=575725#post1]here in the Review Guidelines[/url], previews of ongoing series may not be submitted until the:\n- 4th episode has been viewed for TV series one cours (~13 eps) in length;\n- 6th episode has been viewed for TV series two cours (~26 eps) in length;\n- 10th episode has been viewed for TV series four cours (~52 eps) or longer in length\n\nOnce you\'ve viewed the required episode of this particular series, you\'re more than welcome to repost an updated review to the site. Please do note, however, that incomplete reviews will be removed upon the series\' completion.\n\nThank you for helping to keep MAL\'s reviewing scene alive and well.\n\n'+modname+'\n'+modtype;
	}
	
	else if (pmtypeselect === 'troll') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been removed. \n\nAs stated [url=http://myanimelist.net/forum/?topicid=575725#post1]here in the Review Guidelines[/url], writing reviews for the sole purpose of being "funny" is prohibited.\n\nIf you have any questions or feel that your review has been wrongly identified as a troll, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}

	else if (pmtypeselect === 'gramspell') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been removed. \n\nWhile your review did a good job of ["insert compliment here"], as stated [url=http://myanimelist.net/forum/?topicid=575725#post1]here in the Review Guidelines[/url], all reviews must have good overall spelling and grammar [INSERT OTHER BROKEN RULES, IF APPLICABLE]. While this does not mean that it must be perfect, they do have to be few enough such that they do not detract from the overall review.\n\n[b]How to Improve:[/b]\n- Be sure to use spell checking software such as that included in Microsoft Word\n- Have someone proofread it to identify any noticeable mistakes\n- [THIS STOCK MESSAGE WILL BE FOR REVIEWS THAT LOOK LIKE THEY WERE SERIOUS BUT WERE VERY LACKING]\n- [WILL INSERT RECOMMENDATIONS AS APPROPRIATE]\n\nIf you have any questions or would like some personal tips on how to improve, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}

	else if (pmtypeselect === 'ended') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your previews has been removed.\n\nAs stated [url=http://myanimelist.net/forum/?topicid=575725#post1]here in the Review Guidelines[/url], previews will be removed from currently airing/publishing series upon their completion [b]unless[/b]:\n- the series was dropped by the user past the half-way mark; or,\n- it is less likely that complete reviews will be written for this series because of demographics, number of users, etc.\n\nIf you wish, you can update your review and post it to MAL after you\'ve finished watching the series.\n\nThank you for helping to keep MAL\'s reviewing scene alive and well.\n\n'+modname+'\n'+modtype;
	}

	else if (pmtypeselect === 'edit') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been edited. \n\nAs it stands, your review does a good job of explaining how and why you feel the way you do towards this particular series. However, a few changes were necessary in order for your review to be in full compliance with the Review Guidelines, [url=http://myanimelist.net/forum/?topicid=575725#post1]which can be found here.[/url]\n\nEdits Made:\n- [EDIT I]\n- [EDIT II]\n\nIf you have any questions or disagree with any of the changes, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}
	
	else if (pmtypeselect === 'terribad') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been removed. \n\nAs it stands, your review doesn\'t do much more than simply state that you like this particular series. A review should provide some level of critical evaluation of the work at hand in relation to how you personally feel about it. \n\nFor example, instead of simply saying "I love this anime. The art is good.", try explaining [i]why[/i] it is you like the anime and what specifically about the art is good and whether or not someone else reading your review will like it. \n\nAlso, please review the [url=http://myanimelist.net/forum/?topicid=575725#post1]Review Guidelines here[/url] and ensure that your review follows all of the requirements before resubmitting.\n\nThank you for helping to keep MAL\'s reviewing scene alive and well. If you have any questions or would like some personal tips on how to improve, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}
	
	else if (pmtypeselect === 'notenglish') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been removed. \n\nAs stated in the [url=http://myanimelist.net/forum/?topicid=575725#post1]Review Guidelines[/url], all reviews must be written in English.\n\nThank you for helping to keep MAL\'s reviewing scene alive and well. If you have any questions, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}
		
	else if (pmtypeselect === 'notyetaired') {
		document.getElementById('removal_PM').value = 'Hello ' + recuser + ',\n\nI\'m writing to inform you that one of your reviews has been removed, as reviews cannot be written for a series that has not yet aired.\n\nThank you for helping to keep MAL\'s reviewing scene alive and well. If you have any questions, please feel free to reply to this PM.\n\n'+modname+'\n'+modtype;
	}
}

// Function to get episode number/review ID/review votes
// Will call itself until the information is found or it "times out"
function getProfile(url,controller,duplicateControl) 
{
	var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) 
		{
			var controlIndex = controller; // prevents infinite page loading (will retry a maximum of 3 times)
			
			if (xhr.responseText.indexOf("No reviews were found.") === -1 || xhr.responseText.indexOf("There have been no reviews submitted for this anime yet.") === -1)
			{
				var episodesSeen = xhr.responseText;
				
				if (index < 4) // total review pages loaded - 1
					var i = episodesSeen.indexOf("<strong>" + reviewAnime, duplicateControl);
				else // search for username and bypass title validation
				{
					var bypass = true;
					var i = episodesSeen.indexOf("<a href=\"/profile/" + recuser + "\">");
				}
				
				var dateWritten = episodesSeen.slice(i-250,i); 
				episodesSeen = episodesSeen.slice(i,i+1000);
				var voteRatio = reviewID = episodesSeen;
					
				if (dateWritten.indexOf(animeLink) !== -1 || episodesSeen.indexOf("<a href=\"/profile/" + recuser + "\">") !== -1)
				{		
					if (!/[\?\d]+ chapters<\/div>|[\?\d]+ episodes<\/div>/.test(episodesSeen)) // did the reviewer specify which episode/chapter they're on?
					{
						episodesSeen = "(" + /[\?\d]+ of [\?\d]+ episodes seen|[\?\d]+ of [\?\d]+ chapters read/.exec(episodesSeen)[0] + ")"; 
						if (episodesSeen.indexOf("(1 of 1 ") != -1)
							document.getElementById('numeps').innerHTML = "(1 of 1 " + (isManga ? "chapter read)" : "episode seen)");
						else
							document.getElementById('numeps').innerHTML = episodesSeen;
					}
					else
						document.getElementById('numeps').innerHTML = "Unspecified number of " + (isManga ? "chapters read" : "episodes seen");
					
					// Get review ID
					reviewID = /rhelp\d+/.exec(reviewID)[0].replace('rhelp','');
					reviewID = "http://myanimelist.net/reviews.php?id=" + reviewID;

					// Get Helpful/Not Helpful votes
					voteRatio = /<span id="rhelp[\u0000-\uFFFF]+<\/strong> people/.exec(voteRatio)[0].replace('</strong> people','').replace('<strong>','');
					
					// Get date written
					if (bypass)
						dateWritten = /right;">[\u0000-\uFFFF]+<\/div>/.exec(dateWritten)[0].replace('right;">','').replace('</div>',''); 
					else
						dateWritten = /<div><div style="float: right;">[\u0000-\uFFFF]+<\/div>/.exec(dateWritten)[0].replace('<div><div style="float: right;">','').replace('</div>',''); 

					document.getElementById('votes').innerHTML = "<strong>Helpful:</strong> <em>" + voteRatio + " people</em>"; 
					document.getElementById('dateWritten').innerHTML = "<u>" + dateWritten + '</u>';
				}
				else
				{
					if (i !== -1) //multiple anime with same starting characters or the anime's name is somewhere else on the page
					{
						getProfile("http://myanimelist.net/profile/"+recuser+"/reviews&p="+(index-1),controlIndex,i+1);
					}
					else //not on this page
					{
						index++;
						
						if (index >= 4) // scrape the review from the anime entry page itself (generally faster for older reviews)
						{
							if (isManga)
							{
								var animePage = "http://myanimelist.net/manga/" + /manga.php\?id\=\d+/.exec(document.getElementById('dialog').innerHTML);
								animePage = animePage.replace("manga.php?id=","") + "/foo/reviews&p=";
							}
							else
							{
								var animePage = "http://myanimelist.net/anime/" + /anime.php\?id\=\d+/.exec(document.getElementById('dialog').innerHTML);
								animePage = animePage.replace("anime.php?id=","") + "/foo/reviews&p=";
							}
	
							getProfile(animePage + (index-4),controlIndex,0);
						}
						else
							getProfile("http://myanimelist.net/profile/"+recuser+"/reviews&p="+(index-1),controlIndex,0);
					}
				}
			}
			else // retry
			{
				controlIndex++;

				if (controlIndex < 3)
				{
					index = 1;
					getProfile("http://myanimelist.net/profile/"+recuser+"/reviews&pg=1",controlIndex,0);
				}
				else
				{
					document.getElementById('numeps').innerHTML = "Search failed. <a href=\"http://myanimelist.net/mymessages.php?go=send&toname=AndyRayy\">Let AndyRayy know so he can fix it!</a>"; 
					reviewID = '';
					document.getElementById('dateWritten').innerHTML = "<u>Written: N/A</u>"; 
					document.getElementById('votes').innerHTML = "<strong>Helpful: </strong>N/A";
				}
			}
		}
    };
    xhr.send(null);
}

var malReviewEnhance = function()
{	
	if (document.getElementById('dialog').innerHTML.indexOf('<strong>Review Anime</strong>') !== -1)
	{
		animeLink = document.getElementById('dialog').innerHTML.match(/\/anime\.php\?id\=[0-9]+/)[0];
		isManga = false;
	}
	else
	{
		isManga = true;
		animeLink = document.getElementById('dialog').innerHTML.match(/\/manga\.php\?id\=[0-9]+/)[0];
	}
	
	// if it's a manga, change the link to the correct manga page. Otherwise, do it for the anime page
	animeLink = (isManga ? animeLink.replace("manga.php?id=","manga/") : animeLink.replace("anime.php?id=","anime/"));
	
	// Add new "Removal Reason" textarea and a PM sentnotice div to the page
	var htmlcodecache = document.getElementById('dialog').innerHTML;
	
	// If you don't want the confirmation box to appear when deleting a review, remove the following line of code
	htmlcodecache = htmlcodecache.replace(new RegExp('<input type="submit" name="remove" value="Remove Review" class="inputButton">','im'),'<input type="submit" name="remove" value="Remove Review" onclick="if (this.value == \'Remove Review\') {this.value = \'Really Remove?\'; setTimeout(function(){document.getElementsByName(\'remove\')[0].value = \'Remove Review\'},3000); return false;}" class="inputButton">');
	
	// If adding a new stock message, add the following right before the </select> tag:
	// <option value="HTML_OPTION_VALUE_HERE">Whatever You Want To Name It</option>
	// Please note that whatever you use for HTML_OPTION_VALUE_HERE must be the same as the one you use in the stockMsgs function.
	htmlcodecache = htmlcodecache.replace(new RegExp('<input type="button" class="inputButton" value="Remove Review" [\u0000-\uFFFF]+</textarea></div>\n\t\t\t\t\t','im'),'').replace(/<\/form>/,'<div class="spaceit_pad"><strong>Removal Reason</strong></div><div style="float:left;" id="numeps">Searching.</div><div style="float:right;text-align:right;" id="dateWritten"><strong>Written: </strong>...</div><div style="float:left; clear:both;" id="scriptcontainer"><select id="whichStock" class="inputtext"><option selected disabled>Select Reason</option><option value="preview">Preview</option><option value="troll">Troll</option><option value="gramspell">Grammar/Spelling</option><option value="ended">Series Ended</option><option value="edit">General Edit</option><option value="terribad">Terrible/Bad</option><option value="notenglish">Not English</option><option value="notyetaired">Not Yet Aired</option></select>&nbsp;<form><input type="checkbox" id="edited">Edited?</form>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<form style="display:inline;"><input type="checkbox" id="approved">Approved?</input></form></div><div id="votes" style="float:right;text-align:right;"><strong>Helpful:</strong> ...</div>\n\t\t\t\t<textarea id="removal_PM" cols="'+box_width+'" rows="'+box_height+'" class="textarea"></textarea>\n\t\t\t\t<br />\n\t\t\t\t<div class="inputButton" style="display:inline-block;"><a href=# style="color:white;" id="pmuser">PM User</a></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="inputButton" style="display:inline-block;"><a href=# style="color:white;" id="pmreporter">PM Reporter</a></div>\n\t\t\t\t</form>').replace(/<form method="post">/,'<form method="post">\n\t\t\t\t<div id="notice" style="color: red; font-weight: bold; text-align: center"></div>');
	
	if (getInfo)
	{
		// Adds a little "animation" to the search div
		var searchAnimation = setInterval(function()
		{if (document.getElementById('numeps').innerHTML.indexOf("S") != -1){if (document.getElementById('numeps').innerHTML.indexOf('....') == -1) {document.getElementById('numeps').innerHTML += '.';} else document.getElementById('numeps').innerHTML = "Searching.";} else clearInterval(searchAnimation);}, 300);
	}
	else
	{
		htmlcodecache = htmlcodecache.replace('<div style="float:left;" id="numeps">Searching.</div><div style="float:right;text-align:right;" id="dateWritten"><strong>Written: </strong>...</div>','').replace('<div id="votes" style="float:right;text-align:right;"><strong>Helpful:</strong> ...</div>','');
	}
	
	document.getElementById('dialog').innerHTML = htmlcodecache;

	// Add a listener for the Stock Message select
	document.getElementById('whichStock').addEventListener('change', function() { stockMsgs(); }, false);
	
	// Get the username and make the PM url
	recuser = htmlcodecache.match(/\/profile\/[a-zA-Z0-9&amp;_-]+/g);
	if (typeof recuser[1] != 'undefined')
	{
		recuser = recuser[1].replace(/\/profile\//,'');
	}
	else // User's account was deleted
	{
		recuser = '';
	}
	
	// Get the username of the person who submitted the report
	reportuser = htmlcodecache.match(/\/profile\/[0-9a-zA-Z-_]+/);
	reportuser = reportuser[0].replace(/\/profile\//,'');
	
	// I've come across this more than I thought I would
	// If there is no entry for "Review Anime/Manga", then the series was removed and the review should be as well
	if (typeof animeLink === 'undefined')
	{
		document.getElementById('numeps').innerHTML = "Entry not in MAL's database. <b>Delete this review.</b>"
	}
	else if (getInfo) // Everything is working normally
	{
		if (!isManga)
			reviewAnime = htmlcodecache.match(/anime\.php\?id\=[0-9]+">[a-zA-Z0-9&amp;_-\s,\.★:']+/)[0].replace(/anime\.php\?id\=[0-9]+">/,'');
		else
			reviewAnime = htmlcodecache.match(/manga\.php\?id\=[0-9]+">[a-zA-Z0-9&amp;_-\s,\.★:']+/)[0].replace(/manga\.php\?id\=[0-9]+">/,'');

		reviewAnime = reviewAnime.replace('&amp;','&'); // Fixes error recognizing shows with & in the name
		reviewAnime = reviewAnime.substring(0,45); 		// MAL (randomly?) truncates anime names at ~50 characters
	
		if (recuser === '') // user account deleted
		{
			document.getElementById('numeps').innerHTML = "Search failed. The account no longer exists.";
		}
		else // load the first-most review page of the user
		{	
			getProfile("http://myanimelist.net/profile/"+recuser+"/reviews&pg=1",0,0);
		}	
		
	} // End episode number
		
		// Get the user's review anime/manga and text to add to the PM
		var regexu = new RegExp('<strong>Review [AM][\u0000-\uFFFF]+strong>New Review Text','igm');
		var userrecstuff = htmlcodecache.match(regexu);	
		var user_text = userrecstuff[0].replace(/<strong>/,'[b]').replace(/<\/strong><\/div>/,'[/b]').replace(/\t\t\t\t\t<br>\n\t\t\t\t\t\n\t\t\t\t\t<br>\n\t\t\t\t\t<div class="spaceit_pad"><strong>Review Text<\/strong><\/div>\n\t\t\t\t\t/,'\n[b]Review Text[/b]\n').replace(/\n\t\t\t\t\t<br>\n\t\n\t\t\t\t\t<br>\n\t\t\t\t\t<div class="spaceit_pad"><strong>New Review Text/,'').replace(/\t\t\t\t\t<a href="/,'[url=http://myanimelist.net').replace(/">/,']').replace(/<\/a>/,'[/url]').replace(/<br>/g,'');	
		
		// Adds <br /> tags to the edit box before the edit is submitted
		document.getElementsByName('edit')[0].onclick = function() { 
			updatedText = document.getElementsByName('review_text')[0].value;
			updatedText = updatedText.replace(/\r?\n/g, '<br />\r\n');
			document.getElementsByName('review_text')[0].value = updatedText; }
	
		// Add the event listener to the 'PM User' link and 'PM Reporter'
		document.getElementById('pmuser').onclick = function() { sendPM(recuser,user_text,false); }
		document.getElementById('pmreporter').onclick = function() { if (getInfo) {sendPM(reportuser,reviewID,true);} else {sendPM(reportuser,'',true)} }
}

var sendPM = function(recuser,rectext,toReporter)
{   
    document.getElementById('notice').innerHTML = 'Sending PM...';
 
    // Create PM message post variables
    var post_url = 'http://myanimelist.net/mymessages.php?go=send&toname='+recuser;
    
    if (toReporter)
    {
		if (document.getElementById('approved').checked)
		{
			var post_subject = 'Report Approved';
			var post_message = document.getElementById('removal_PM').value;
		}
		else
		{
			var post_subject = 'Report Denied';
			var post_message = (rectext !== '' ? document.getElementById('removal_PM').value + "\n\n[b]Review Link:[/b]\n" + rectext : document.getElementById('removal_PM').value);
		}
	}
	else 
	{
		var post_subject = (document.getElementById('edited').checked ? 'Review Edited' : 'Review Removed');
        var post_message = document.getElementById('removal_PM').value+'\n\n'+rectext;
	}
        var post_other = 'Sending...';
        
        // Send message to user
    $.post(post_url, {subject: post_subject, message: post_message, sendmessage: post_other})
        .done(function(data) {
            var resultCode = (/Successfully sent/.test(data) ? 0 : /You may only have 75/.test(data) ? 2 : /You may only have 100/.test(data) ? 3 : 1);
            tryAgain(resultCode);
})
        .fail(function() { tryAgain(1); });
}

// Little function to make the repeated "Try again" a bit cleaner
var tryAgain = function(trytype) {
	var result;
	
	switch (trytype)
	{
		case 0: result = 'Done!'; break;
		case 1: result = 'Please try again.'; break;
		case 2: result = 'Inbox is full!'; break;
		case 3: result = 'Sent Box is full!'; 
	}
	
	document.getElementById('notice').innerHTML = result;
}

//Waits until the page has finished loading before modifying its contents
if (document.readyState==="loading") {
	if (window.addEventListener) window.addEventListener("DOMContentLoaded",malReviewEnhance,false);
	else if (window.attachEvent) window.attachEvent("onload",malReviewEnhance);
} else if (document.readyState==="complete") {
	malReviewEnhance();
} else {
	if (window.addEventListener) window.addEventListener("load",malReviewEnhance,false);
	else if (window.attachEvent) window.attachEvent("onload",malReviewEnhance);
}
