document.addEventListener("DOMContentLoaded", function (){
//fetches data 
fetch("/journal/api/moods")
.then(response => response.json())
.then(moods => {
//extracts days and mood values from fetched data
const weekDay =["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const data = weekDay.map(day => {
const moodEntry = moods.find(mood => mood.day === day);
return moodEntry ? moodEntry.mood: 2;
});
const ctx = document.getElementById("moodGraph").getContext('2d');
let gradient = ctx.createLinearGradient(500,0,0,0);
gradient.addColorStop(0,'rgba(9,9,121)');
gradient.addColorStop(1,'rgba(8,135,199 ,0.8)' );
//creates a line graph
new Chart(ctx, {
  type:'line',
  data:{
  labels: weekDay,
  datasets:[{
      data: data,
      label: "Mood",
      borderColor:'rgba(35,30,64)',
      backgroundColor: gradient,
      fill: true,
      tension: 0.2,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(120, 124, 245)',
      
      
  }]
},
  options: {
      responsive:true,
      animation:{
        duration:1300,
        easing:'easeInSine',
      },
        plugins:{
          tooltip:{
            callbacks:{
              label:function(context){
                  const moodEmojis = {
                    5: '😃 Happy',
                    4: '🤩 Excited',
                    3: '😐 Neutral',
                    2: '😣 Angry',
                    1: '😥 Sad'
                  };
                  const mood =context.raw;
                  return moodEmojis[mood] || '';

                }
          }
        }
      },

      scales: {
          y:{
              beginAtZero:true,
              min: 1,
              max:5,
              ticks:{
                stepSize: 1,
                callback: function(value){
                  const moodEmojis = {
                    5: '😃 Happy',
                    4: '🤩 Excited',
                    3: '😐 Neutral',
                    2: '😣 Angry',
                    1: '😥 Sad'
                  };
                  return moodEmojis[value] || value;
                },
        
              },
              title:{
                display:true,
                text:'Mood',
                font:{
                  size:14,
                  family:'Helvetica',
                  weight: 'bold',
                  
              },
              color:'rgb(120, 124, 245)'
            }

          },
          x:{
            title:{
              display:true,
              text: 'Days of the week',
              font:{
                size:14,
                family:'Helvetica',
                weight: 'bold',  
              },
              color:'rgb(120, 124, 245)'
            },
            grid:{
              display: false,

            }
          }
      }
  }
});
})
.catch(error =>{
  console.error("error mood", error);
})
});