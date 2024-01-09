const board = document.getElementById('dataShow');
const expenses = document.getElementById('expenses');

window.addEventListener("DOMContentLoaded" , async() =>{
    const Lead = await axios.get('http://localhost:5000/leaderboard')
    const data = Lead.data;

    data.forEach(ele => {
        showBoard(ele);
    });


})


expenses.addEventListener('click' , ()=>{
    window.location.replace('../expense/index.html');
})

showBoard = (res) => {

    var ul = document.createElement('ul');

    
    var li1 = document.createElement('li');
    li1.textContent = res['username'];
    li1.className = "name";
    ul.appendChild(li1);

    var li2 = document.createElement('li');
    li2.textContent = res['totalExpenses'];
    li2.className = "amount";
    ul.appendChild(li2);

    board.appendChild(ul)
}