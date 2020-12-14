// Call the dataTables jQuery plugin
$(document).ready(function() {
  setTimeout(() => {
    $('#dataTable').DataTable().destroy();
  }, 168);
});
