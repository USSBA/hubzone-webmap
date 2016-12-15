// // Catch control+p and re-layout page for printing
// $(document).bind("keydown", function(e){
//   if((e.ctrlKey || e.metaKey) && e.keyCode == 80){
//     beforePrint();
//     window.setTimeout(function(){
//       window.print()
//     }, 1000);
//     window.setTimeout(function(){
//       afterPrint();
//     }, 1000);
//   }
// });

// // Listener for map icon click
// $(function() {
//   $('#map-print').click(function() {
//     console.log('print button selected');
//     beforePrint();
//     window.setTimeout(function(){
//       window.print()
//     }, 1000);
//     window.setTimeout(function(){
//       afterPrint();
//     }, 8000);
//   });
// });

// function beforePrint() {
//     console.log('Before printing: ');

//     var bounds = map.getBounds();
//     var center = map.getCenter();
//     $('.map-body').width(450);
//     $('.map-body').height(450);
//     google.maps.event.trigger(map, 'resize');
//     map.fitBounds(bounds);
//     if (mapMarkers.length > 0){
//       map.setCenter(mapMarkers[0].position);
//     } else {
//       map.setCenter(center);
//     }
//     sidebar.close()
// };

// function afterPrint() {
//     console.log('After printing: ');
//     $('.map-body').width('100%');
//     $('.map-body').height('100%');
//     //map.setCenter(center);
//     google.maps.event.trigger(map, 'resize');
// };

// if (window.matchMedia) {
//     var mediaQueryList = window.matchMedia('print');
//     mediaQueryList.addListener(function(mql) {
//         if (mql.matches) {
//             beforePrint();
//         } else {
//             afterPrint();
//         }
//     });
// }

// //ie5+ trigger
// window.onbeforeprint = beforePrint;
// window.onafterprint = afterPrint;
