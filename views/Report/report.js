const download = document.getElementById('download');
const table = document.getElementById('table');
const totalAmount = document.getElementById('totalAmount');
const downloadHistory = document.getElementById('downloadH');


window.addEventListener("DOMContentLoaded" , async () => {

    const token = localStorage.getItem("token");
       const res = await axios.get('http://localhost:5000/report/expenses', { headers: { "Authorization": token } })
        
       const data = res.data.details;
       const total = res.data.totalAmount;
       const download = res.data.download;

       data.forEach(ele => {
            showData(ele)
       });

       download.forEach(ele => {
            showDownload(ele)
       })

       

     

       totalAmount.textContent = total;


       
})


download.addEventListener('click', async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get('http://localhost:5000/download', { headers: { "Authorization": token } })
    if (response.status === 201) {
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
    } else {
        throw new Error(response.data.message)
    }
})

showData = (data) => {

    var row = document.createElement('tr');
    table.appendChild(row);



    var date = document.createElement('td');
    date.textContent = data['createdAt'];
    row.appendChild(date);

    var des = document.createElement('td');
    des.textContent = data['description'];
    row.appendChild(des);

    var cat = document.createElement('td');
    cat.textContent = data['category'];
    row.appendChild(cat);

    var expense = document.createElement('td');
    expense.className = "expense";
    expense.textContent = data['amount'];
    row.appendChild(expense);
}

showDownload = (data) => {
   var li = document.createElement('li');
   var details = data['fileUrl']
   var a = document.createElement('a');
   a.href = details
   a.textContent = data['createdAt'];
   li.appendChild(a);
   downloadHistory.appendChild(li);
}