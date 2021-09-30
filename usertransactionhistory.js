
let transactionStatusArray = {
    '11': 'You paid',
    '12': 'You received',
    '22': 'Request received',
    '21': 'You requested'
}
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', 'https://dev.onebanc.ai/assignment.asmx/GetTransactionHistory?userId=1&recipientId=2', true);
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
            let transactionData = JSON.parse(xmlhttp.responseText);
            // call function for removing data which ahs pending and expired state
            let newTransactionData = removePendingOrExpired(transactionData.transactions);

            callForDateArrangements(newTransactionData);
        }
    }
}

xmlhttp.setRequestHeader('Content-Type', 'text/xml');
xmlhttp.send();
function removePendingOrExpired(transactionData) {
    const newtransactionData = transactionData.filter(d => d.status !== 1 && d.status !== 3);
    return newtransactionData;

}

function callForDateArrangements(newTransactionData) {
    const container = {};
    let userName = '';
    const usersByLikes = newTransactionData.map(item => {
        let startDate = new Date(item.startDate).getDate();
        userName = item.partner.vPay.split('@')[0];
        container[`${startDate}`] = [];
    })
    let firstLetter = userName[0].toUpperCase();
    document.querySelector('.userimage').innerText = firstLetter.toUpperCase();
    userName[0] = firstLetter;
    let username = callForUserNmae(userName);
    document.querySelector('.username').innerText = username;
    // add data into array
    let finalData = callForDateArrangementsManipulation(newTransactionData, container);
    // let finalData = {
    //     '24': [{
    //         "id": 1957,
    //         "startDate": "2021-02-24T22:24:00",
    //         "endDate": "2021-02-24T22:24:02",
    //         "amount": 10000.0,
    //         "direction": 1,
    //         "type": 2,
    //         "status": 2,
    //         "description": "Rent",
    //         "customer": {
    //             "vPayId": 1,
    //             "vPay": "manindersingh@onebanc"
    //         },
    //         "partner": {
    //             "vPayId": 2,
    //             "vPay": "johnDoe@oenabanc"
    //         }
    //     },
    //     {
    //         "id": 1957,
    //         "startDate": "2021-02-24T22:24:00",
    //         "endDate": "2021-02-24T22:24:02",
    //         "amount": 10000.0,
    //         "direction": 2,
    //         "type": 1,
    //         "status": 2,
    //         "description": "Rent",
    //         "customer": {
    //             "vPayId": 1,
    //             "vPay": "manindersingh@onebanc"
    //         },
    //         "partner": {
    //             "vPayId": 2,
    //             "vPay": "johnDoe@oenabanc"
    //         }
    //     },
    //     {
    //         "id": 1957,
    //         "startDate": "2021-02-24T22:24:00",
    //         "endDate": "2021-02-24T22:24:02",
    //         "amount": 10000.0,
    //         "direction": 2,
    //         "type": 1,
    //         "status": 2,
    //         "description": "Rent",
    //         "customer": {
    //             "vPayId": 1,
    //             "vPay": "manindersingh@onebanc"
    //         },
    //         "partner": {
    //             "vPayId": 2,
    //             "vPay": "johnDoe@oenabanc"
    //         }
    //     }
    //     ], '25': [{
    //         "id": 1959,
    //         "startDate": "2021-02-25T00:00:00",
    //         "endDate": "0001-01-01T00:00:00",
    //         "amount": 760.0,
    //         "direction": 2,
    //         "type": 2,
    //         "status": 2,
    //         "description": "",
    //         "customer": {
    //             "vPayId": 1,
    //             "vPay": "manindersingh@onebanc"
    //         },
    //         "partner": {
    //             "vPayId": 2,
    //             "vPay": "johnDoe@oenabanc"
    //         }
    //     }], '27': [{
    //         "id": 1961,
    //         "startDate": "2021-02-27T22:24:40",
    //         "endDate": "2021-02-27T22:24:40",
    //         "amount": 1000.0,
    //         "direction": 1,
    //         "type": 2,
    //         "status": 2,
    //         "description": "Rent",
    //         "customer": {
    //             "vPayId": 1,
    //             "vPay": "manindersingh@onebanc"
    //         },
    //         "partner": {
    //             "vPayId": 2,
    //             "vPay": "johnDoe@oenabanc"
    //         }
    //     }]
    // }
    var k = 0;
    for (const i of Object.keys(finalData)) {
        // select id of body container
        if (k === 0) {
            insertedDiv = 'UserTransaction-screen-body';
            document.getElementById(`${insertedDiv}`) ? document.getElementById(`${insertedDiv}`).insertAdjacentHTML('afterBegin', `<div id=transactionbody${k} style="background-color:lightgray;   
            /* border-color: black;
            border-style: solid; */
            display: flex;
            flex-direction: column;"></div>`) : '';
        } else {
            insertedDiv = 'transactionbody' + JSON.stringify(k - 1);
            document.getElementById(`${insertedDiv}`) ? document.getElementById(`${insertedDiv}`).insertAdjacentHTML('afterEnd', `<div id=transactionbody${k} style="background-color:lightgray;   
            /* border-color: black;
            border-style: solid; */
            display: flex;
            flex-direction: column;"></div>`) : '';
        }

        k++;
        // Now add transaction boxes into transaction history divison
    }
    let l = 0;
    for (const i of Object.keys(finalData)) {
        // add dotted div
        let displayDate = getDate(finalData[i][0].startDate);
        document.querySelector(`#transactionbody${l}`).insertAdjacentHTML('beforebegin', `<div style="position:relative; display: flex; z-index: 10; place-items:center;place-content:center;">
        <div style="background: white; padding: 0 1rem;">${displayDate}</div>
        <hr style="position:absolute; width:100%; top: 0%; border-bottom: none; border-style: dotted; z-index: -1;">
    </div>`);
        for (let j = 0; j < finalData[i].length; j++) {
            if (j === 0) {
                document.getElementById(`transactionbody${l}`) ? document.getElementById(`transactionbody${l}`).insertAdjacentHTML('afterBegin', `<div id=transactionhistorybody${j} style="background-color: lightgray;
                width: 30rem;
                border-color: black;
                border-style: solid;
                margin: 26px;"></div>`) : '';
            }
            else {
                document.getElementById(`transactionhistorybody${j - 1}`) ? document.getElementById(`transactionhistorybody${j - 1}`).insertAdjacentHTML('afterEnd', `<div id=transactionhistorybody${j} style="background-color: lightgray;
                width: 30rem;
                border-color: black;
                border-style: solid;
                margin: 26px;"></div>`) : '';
            }
            let transactionalStatus = JSON.stringify
                (finalData[i][j].type) + JSON.stringify(finalData[i][j].direction)
            if (finalData[i][j].direction === 1) {
                document.querySelector(`#transactionbody${l} #transactionhistorybody${j}`).style.alignSelf = 'flex-end';
                document.querySelector(`#transactionbody${l} #transactionhistorybody${j}`).insertAdjacentHTML('afterbegin', `<div style="display:flex; flex-direction: row;">
               <div style="display:flex; flex-direction: column; display: flex;
               place-content: center;
               width: 50%;
               background-color:lightgray;
               height: 100px;">
               <div style="font-size: 2rem;">&#x20b9;${finalData[i][j].amount}</div>
               <div class = "transactionalSecondDiv" style="
               background-color:lightgray;">     </div>
               </div>
               <div style="display:flex; flex-direction: column; display: flex;
               flex-direction: column;
               width: 50%;
               padding-right: 0.5rem;
               background-color:lightgray;
               height: 100px;">
               <div class= "transactionStaus" style="height: 50%; display: flex; place-items: end; place-self: end;"> </div>
               <div style="height: 50%; display: flex; place-items: center; place-self: end;
               background-color:lightgray;"> > </div>
               </div>
               </div>`)
                if (transactionalStatus == '11' || transactionalStatus == '12') {
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).innerHTML = `<span>Transaction ID <br/> ${finalData[i][j].id}<span>`;
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionStaus`).innerHTML = `<span>
                    &#10004;
                    </span>${transactionStatusArray[transactionalStatus]}`;
                }
                if (transactionalStatus == '22' || transactionalStatus == '21') {
                    if (transactionalStatus == '22') {
                        document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).insertAdjacentHTML('afterbegin', `<div>
                    <input type="button" id="slide_start_button" value="Pay">
                    <input type="button" id="slide_stop_button"  value="Reject">
                </div>`)
                    } else {
                        if (transactionalStatus == '21') {
                            document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).insertAdjacentHTML('afterbegin', `<div>
                        <input type="button" id="slide_start_button" value="Cancel">
                    </div>`)
                        } else {

                        }
                    }
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionStaus`).innerHTML = `<span>
                    &#10007;
                    </span>${transactionStatusArray[transactionalStatus]}`;
                }
            } else {
                document.querySelector(`#transactionbody${l} #transactionhistorybody${j}`).style.alignSelf = 'flex-start';
                document.querySelector(`#transactionbody${l} #transactionhistorybody${j}`).insertAdjacentHTML('afterbegin', `<div style="display:flex; flex-direction: row;">
                <div style="display:flex; flex-direction: column; display: flex;
               place-content: center;
               width: 50%;
               background-color:lightgray;
               height: 100px;">
               <div style="font-size: 2rem;">&#x20b9;${finalData[i][j].amount}</div>
               <div class = "transactionalSecondDiv" style="
               background-color:lightgray;">     </div>
               </div>
               <div style="display:flex; flex-direction: column; display: flex;
               flex-direction: column;
               width: 50%;
               padding-right: 0.5rem;
               background-color:lightgray;
               height: 100px;">
               <div class= "transactionStaus" style="height: 50%; display: flex; place-items: end; place-self: end;"></div>
               <div style="height: 50%; display: flex; place-items: center; place-self: end;
               background-color:lightgray;"> > </div>
               </div>
                </div>`)
                if (transactionalStatus == '11' || transactionalStatus == '12') {
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).innerHTML = `<span>Transaction ID <br/> ${finalData[i][j].id}<span>`;
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionStaus`).innerHTML = `<span>
                    &#10004;
                    </span>${transactionStatusArray[transactionalStatus]}`;
                }
                if (transactionalStatus == '22' || transactionalStatus == '21') {
                    if (transactionalStatus == '22') {
                        document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).insertAdjacentHTML('afterbegin', `<div>
                        <input type="button" id="slide_start_button" value="Pay">
                        <input type="button" id="slide_stop_button"  value="Reject">
                    </div>`)
                    } else {
                        if (transactionalStatus == '21') {
                            document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionalSecondDiv`).insertAdjacentHTML('afterbegin', `<div>
                            <input type="button" id="slide_start_button" value="Cancel">
                        </div>`)
                        } else {

                        }
                    }
                    document.querySelector(`#transactionbody${l} #transactionhistorybody${j} .transactionStaus`).innerHTML = `<span>
                    &#10007;
                    </span>${transactionStatusArray[transactionalStatus]}`;

                }
            }
        }
        l++;
    }

}

function callForDateArrangementsManipulation(usersByLikes, container) {
    for (var i of Object.keys(container)) {
        usersByLikes.map(item => {
            let startDate = new Date(item.startDate).getDate();
            if (i == startDate) {
                container[`${startDate}`].push(item);
                // return container;
            }
        })
    }
    return container;
}
function getTrnasactionDetails(transact) {
    let lionboostchoosenObj = {
        userName: transact
    };
    // lionboostchoosenObj.oddValue = '+' + lionboostchoosenObj.oddValue;
    return html.replace(/{{(\w+)}}/gm, function (m, k) {
        return lionboostchoosenObj[k] || '';
    });
}


function getDate(transactionDate) {
    var today = new Date(transactionDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = today.getDate();
    const year = today.getFullYear();
    const monthName = monthNames[today.getMonth()]
    let time = dateTOAMORPM(transactionDate);
    let finalDate = '';
    finalDate = date + ' ' + monthName + ' ' + year + ', ' + time;
    return finalDate;
}
function dateTOAMORPM(currentDateTime) {
    var hrs = new Date(currentDateTime).getHours();
    var mnts = new Date(currentDateTime).getMinutes();
    var AMPM = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    mnts = mnts < 10 ? '0' + mnts : mnts;
    var result = hrs + ':' + mnts + ' ' + AMPM;
    return result;
}

function callForUserNmae(userName){
    var index = userName.match(/[A-Z]/g).map(function (cap) {
        return userName.indexOf(cap);
    });
    var newString = userName.substring(0,index) + ' ' + userName.substring(index);
    return capitalizeFirstLetter(newString);    
}
function capitalizeFirstLetter(userName) {
    return userName.charAt(0).toUpperCase() + userName.slice(1);
  }