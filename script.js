//Live Search Function

//setup before functions
var typingTimer;                
var doneTypingInterval = 500;  //time in ms, 0.5 second for example
var $input = $('#myInput');

//on keyup, start the countdown
$input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
    clearTimeout(typingTimer);
});


//Github API Fetch
function doneTyping() {

    fetch('https://api.github.com/users/' + document.getElementById("myInput").value)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            //reset all containers
            document.getElementById("UserDetailsComponent").innerHTML = '';
            document.getElementById("UserRepositoryComponent").innerHTML = '';
            document.getElementById("PageContainer").innerHTML = '';

            if(data.login!=null){

            document.getElementById("UserDetailsComponent").innerHTML = '';
            document.getElementById("UserDetailsComponent").innerHTML += '<div class="col-2"><img class="avatar" src="' + data.avatar_url + '"></div> <div class="col-8"> <h2 class="username">' + data.name + '</h2> <h6 class="text-muted"> <i class="fas fa-laptop userinfo"></i> &nbsp' + data.bio + '</h6> <h6 class="text-muted"> &nbsp<i class="fas fa-map-marker-alt userinfo"></i> &nbsp ' + data.location + '</h6> <h6 class="text-muted"> <i class="fab fa-twitter userinfo"></i> &nbsp ' + data.twitter_username + '</h6> <h6 class="text-muted"> <i class="fas fa-link userinfo"></i> &nbsp <a href="https://github.com/' + data.login + '">https://github.com/' + data.login + '</a></h6> </div>';


            fetch('https://api.github.com/users/' + data.login + '/repos')
                .then(function (response) {
                    return response.json();
                })
                .then(function (datarepo) {

                    //reset repository container
                    document.getElementById("UserRepositoryComponent").innerHTML = '';

                    //get number of pages
                    if (datarepo.length % 10 == 0) {
                        pages = datarepo.length / 10;
                    } else {
                        pages = Math.floor(datarepo.length / 10) + 1;

                    }

                    //display repository cards and assign classes
                    count = 0;
                    for (j = 1; j <= pages; j++) {

                        for (k = 1; k <= 10; k++) {

                            if (count >= datarepo.length) {
                                break;
                            }

                            document.getElementById("UserRepositoryComponent").innerHTML += ' <div class="col-sm-6 ' + inWords(j) + '" style="margin-bottom: 10px;"> <div class="card" style="background-color: #393743;  height: 100%;"> <div class="card-body"> <h5 class="card-title username">' + datarepo[count].name + '</h5> <p class="card-text" style="font-size: 14px;">' + datarepo[count].description + '</p> <button class="btn btn-sm btn-secondary" >' + datarepo[count].language + '</button> </div> </div> </div>';

                            count++;

                        }
                    }


                    //display pages in pagination according to number of pages calculated
                    document.getElementById("PageContainer").innerHTML = '';
                    document.getElementById("PageContainer").innerHTML += ' <li class="page-item"> <btn class="page-link pagebtn2" aria-label="Previous"> <span aria-hidden="true">&laquo;</span> </btn> </li>';

                    for (j = 1; j <= pages; j++) {
                        document.getElementById("PageContainer").innerHTML += '<li class="page-item"><a id="' + inWords(j) + '" onclick="pageswitch(this.id);" class="page-link pagebtn">' + j + '</a></li>'
                    }

                    document.getElementById("PageContainer").innerHTML += ' <li class="page-item"> <btn class="page-link pagebtn2"  aria-label="Next"> <span aria-hidden="true">&raquo;</span> </btn> </li>';

                    //default page 1 setting
                    pageswitch("one ");

                })
                .catch(function (err) {

                });

            }else{
                
                //if user doesn't exist
                document.getElementById("UserDetailsComponent").innerHTML = '';
                document.getElementById("UserDetailsComponent").innerHTML += '<div class="col-2"><i class="fas fa-exclamation-triangle username" style="font-size: 5rem;"></i></div> <div class="col-8"> <h2 class="username">' + 'User not found' + '</h2>  </div>';

            }
        })
        .catch(function (err) {

        });

}


//number to word converter function
var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function inWords(num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + '' + a[n[5][1]]) + '' : '';
    return str;
}

//page switching function
function pageswitch(pageno) {

    for (j = 1; j <= pages; j++) {

        if (inWords(j) != pageno) {

            var a = document.getElementsByClassName(inWords(j));
            for (i = 0; i < a.length; i++) {
                a[i].style.display = "none";
            }
        } else {
            var a = document.getElementsByClassName(inWords(j));
            for (i = 0; i < a.length; i++) {
                a[i].style.display = "block";
            }
        }


    }

}






