var going = document.getElementsByClassName("yes");
var notGoing = document.getElementsByClassName("no"); 
var trash = document.getElementsByClassName("delete");

// Array.from(going).forEach(function(element) {
//       element.addEventListener('click', function(){
//         const question = this.parentNode.parentNode.childNodes[1].innerText
//         const answer = this.parentNode.parentNode.childNodes[3].innerText
//         fetch('messages', {
//           method: 'put',
//           headers: {'Content-Type': 'application/json'},
//           body: JSON.stringify({
//             'question': question,
//             'answer': answer,
//             'going': true,
//             'attending' : true // added this prop after created a const going var; this didn't send any results to db, so i will continue the not going btn to see if whole thing is needed for it to work
//           })
//         })
//         .then(response => {
//           if (response.ok) return response.json()
//         })
//         .then(data => {
//           console.log(data)
//           window.location.reload(true)
//         })
//       });
// });

// //Adding not going option
// Array.from(notGoing).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const question = this.parentNode.parentNode.childNodes[1].innerText
//     const answer = this.parentNode.parentNode.childNodes[3].innerText
//     // const notGoing = true
//     const going = this.parentNode.parentNode.childNodes[5].innerText
//     fetch('messages', {
//       method: 'put',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         'question': question,
//         'answer': answer,
//         'going': going,
//         'attending': false // last added prop, now go to routes.js to add conditional statement
//       })
//     })
//     .then(response => {
//       if (response.ok) return response.json()
//     })
//     .then(data => {
//       console.log(data)
//       window.location.reload(true)
//     })
//   });
// });

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const question = this.parentNode.parentNode.childNodes[1].innerText
        const answer = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'question': question,
            'answer': answer
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

//Chat gpt helped me with this function
document.addEventListener('DOMContentLoaded', function() {
  // Add click event handler to all "See Answer" buttons
  var toggleAnswerButtons = document.querySelectorAll('.toggleAnswer');
  Array.from(toggleAnswerButtons).forEach(function(button) {
    button.addEventListener('click', function() {
      var index = this.getAttribute('data-index');
      // Find the corresponding answer span and toggle the "hide" class
      var answerSpans = document.querySelectorAll('.messages .message:nth-child(' + (parseInt(index) + 1) + ') .answer');
      // Iterate over the NodeList and toggle the class for each element
      answerSpans.forEach(function(answerSpan) {
        answerSpan.classList.toggle('hide');
      });
    });
  });
});


