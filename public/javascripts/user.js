$(document).ready(function() {
  var strCreatedHTMLOutput = '';
  var strEnrolledHTMLOutput = '';

  $.ajax('/course/createdbyuser/' + userID, {
    dataType: 'json',
    error: function() {
      console.log("ajax error");
    },
    success: function(data) {
      console.log(data);
      if(data.length > 0) {
        if(data.status && data.status === 'error') {
          strCreatedHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem,
          totalItems = data.length,
          arrLI = [];
          for(intItem = totalItems - 1; intItem >= 0; intItem --) {
            arrLI.push('<a href="/course/' + data[intItem]._id + '">' + data[intItem].courseName + "</a>");
          }
          strCreatedHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
        }
      } else {
        strCreatedHTMLOutput = "<li>You haven't created any courses yet</li>";
      }
      $('#mycreatedcourses').html(strCreatedHTMLOutput);
    }
  });

  $.ajax('/course/enrolledinbyuser/' + userID, {
    dataType: 'json',
    error: function() {
      console.log("ajax error");
    },
    success: function(data) {
      console.log(data);
      if(data.length > 0) {
        if(data.status && data.status === 'error') {
          strEnrolledHTMLOutput = "<li>Error: " + data.error + "</li>";
        } else {
          var intItem,
            totalItems = data.length,
            arrLI = [];
          for(intItem = totalItems - 1; intItem >= 0; intItem --) {
            arrLI.push('<a href="/course/' + data[intItem]._id + '">' + data[intItem].courseName + "</a>");
          }
          strEnrolledHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
        }
      } else {
        strEnrolledHTMLOutput = "<li>You haven't enrolled in any courses yet</li>";
      }
      $('#myenrolledcourses').html(strEnrolledHTMLOutput);
    }
  });
});