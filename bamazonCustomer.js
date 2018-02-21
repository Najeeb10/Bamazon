var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : null,
  database : 'bamazon'
})

var port = 3000;



connection.connect(function (error) {
  if (error) throw error;
  console.log("Dope connection!");

 display(); 
})

var display = function(){
        connection.query("SELECT * FROM products", function(error,response){
            // console.log(response)
            for(var i=0 ; i < response.length ; i++){
                console.log(response[i].item_id+" || "+response[i].product_name+" || "+
                response[i].department_name+" || "+response[i].price+" || "+response[i].
                    stock_quantity+"\n");

            }
             forCustomer(response);
        })

    }


function forCustomer(response){

    inquirer.prompt([{ 
        type: 'input',
        name: 'choice',
        message: "What do you want to buy?"
    }]).then(function(answer){
        var correct = false; 
        // answer.choice = answer.choice.toLowerCasc();
        for( var i=0 ; i < response.length ; i++ ){
            if(response[i].product_name==answer.choice){
                correct=true;
                var product=answer.choice;
                var id=i;
                break;
            }
        }
        if(correct === true){

                inquirer.prompt({
                    type: 'input',
                    name: 'quant',
                    message: "How many do you want?",
                    validate: function(value){
                        if(isNaN(value)==false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if( (response[id].stock_quantity-answer.quant) > 0 ){
                        connection.query("UPDATE products SET stock_quantity = ? Where product_name = ? " ,
                         [ response[id].stock_quantity-answer.quant , product ] , function(error , response2){ 
                            console.log("Item Purchased!");
                            display();
                        })
                    }else{
                    	console.log("Not enough stock")
                    	forCustomer(response);
                    }

                })
            }else{
            	console.log("Choose another product")
            	 forCustomer(response);
            }
        
    })

}

