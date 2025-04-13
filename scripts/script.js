/* Função para adicionar veiculos ela segue o fluxo: post_veicle -> create_veicle*/
const post_veicle = async (plate,model,color) => {
  
  let formData = new FormData();
  formData.append('plate', plate);
  formData.append('model', model);
  formData.append('color', color);

  let url = 'http://127.0.0.1:5000/yard';
  let requisition =  await fetch(url, {
    method: 'post',
    body: formData
  });
  if (!requisition.ok)
  {
    let error = await requisition.json();
    alert(error.message);
  }
  else
  {
    let response = requisition.json();
    response.then((data)=>{
      console.log(data.checkin_date);
      create_veicle(data.plate, data.model, data.color, data.checkin_date, data.elapsed_time);
    })
    alert("Veículo adicionado com sucesso!");
  }
}  

/*Método para obtenção de todo o pátio. Os dados serão obtidos e alimentados para a função generate_yard. Fluxo: get_yard -> generate_yard -> create_veicle*/

const get_yard = async () =>{
  
  let url = 'http://127.0.0.1:5000/yard';
  let requisition = await fetch(url,{
    method: 'get',
  })
  if (!requisition.ok)
  {
    let error = await requisition.json();
    alert(error);
  }
  else
  {
    let response = requisition.json();
    response.then((data) =>{
        generate_yard(data.yard);
    })
  }
}

/*Método para obter a receita no banco de dados. Fluxo: get_income -> update_income*/

const get_income = async () => {
  let url = 'http://127.0.0.1:5000/income'
  let requisition = await fetch(url,{
    method: 'get'
  })
  if (!requisition.ok)
  {
    let error = await requisition.json()
    console.log(error);
  }
  else
  {
    let response = requisition.json();
    response.then((data) =>{
      update_income(data);
    })
  }
}

/*Método para procurar um único veiculo no banco de dados para poder mostrar suas informações na caixa de checkout. 
Este método é usado assim que clicka no veiculo dentro da relação do pátio na aplicação. Fluxo: search_yard -> open_checkout -> get_price
                                                                                                                             -> convert_time*/

const search_yard =  async (plate) => {
  let url = `http://127.0.0.1:5000/search_yard?plate=` + plate;
  let requisition = await fetch(url,{
    method: 'get'
  })
  if (!requisition.ok)
  {
    let error = await requisition.json();
    console.log(error);
    return null;
  }
  else
  {
    let response = requisition.json()
    response.then((data) =>{
      open_checkout(data);
    })
  }
}

/*Métod usado somente para obter o valor do estacionamento no back-end. Fluxo: get_price -> update_price*/

const get_price = async (plate) => {
  let url = `http://127.0.0.1:5000/income_price?plate=` + plate;
  let requisition = await fetch(url,{
    method: 'get',
  })
  if (!requisition.ok)
  {
    let error = await requisition.json();
    console.log(error);
    return null;
  }
  else
  {
    let data = await requisition.json();
      update_price(data);
  }
}

/*Método de pagamento de veículo, ele é parte da cadeia de métodos do checkout_veicle. Fluxo: pay_veicle -> update_income*/

const pay_veicle = async (formData) => {
  let url = 'http://127.0.0.1:5000/income'
  let requisition = await fetch(url, {
    method: 'post',
    body: formData
  })
  if (!requisition.ok)
  {
    error = requisition.json();
    alert(error);
  }
  else
  {
    let response = requisition.json();
    response.then((data) => {
      update_income(data);
    })
  }
}

/* Método para exlcuir um veiculo da base de dados */

const delete_veicle = async (plate) => {
  url = "http://127.0.0.1:5000/yard?plate=" + plate;
  let requisition = await fetch(url, {
    method: 'delete'
  })
  let response = await requisition.json()
  alert(response.message);
}

/*Método de validação de dados. Utilizei uma validação mais simples mas o método pode ser expandido pra ser usado com expressões regulares*/

function data_validation()
{
  plate = document.getElementById("input_plate");
  model = document.getElementById("input_model");
  color = document.getElementById("input_color");
  
  if (plate.value === '')
  {
    alert("Por favor, insira a placa do veículo")
  }
  else
  {
    if (model.value === '')
      {
        alert('Por favor, insira o modelo do veiculo')
      }
      else
      {
        if (color.value === '')
          {
            alert('Por favor, insira a cor do veículo')
          }    
          else
          {
            post_veicle(plate.value,model.value,color.value);
          }
      }
  }
}

/*Método que organiza a data no seguinte formato Dia/Mês/Ano às Horas:Minutos:Segundos */

function organizedate(date)
{ 
  new_date = new Date(date);
  return `${String(new_date.getUTCDate()).padStart(2,0)}/${String(new_date.getUTCMonth()+1).padStart(2,0)}/${new_date.getUTCFullYear()} às 
          ${new_date.getUTCHours().toString().padStart(2,0)}:${new_date.getUTCMinutes().toString().padStart(2,0)}:${new_date.getUTCSeconds().toString().padStart(2,0)}`;
}

/*Método que cria um ou mais veículos na lista de veiculos da pagina */

function create_veicle(plate, model, color, date, elapsed_time)
{
  yard_list = document.getElementById("yard_list");
  veicle = document.createElement("li");

  veicle.addEventListener("click", function() {
    search_yard(plate)
  });

  time = convert_time(elapsed_time);

  veicle_description = document.createElement("p");
  checkin_date = document.createElement("p");
  elapsed_time = document.createElement("p");

  text = document.createTextNode(plate + " / " + model + " " + color);
  checkin_text = document.createTextNode('Entrada: ' + organizedate(date));
  time_text = document.createTextNode(`Permanência: ` + time)
  
  veicle_description.appendChild(text);
  veicle_description.classList.add("veicle_description");

  checkin_date.appendChild(checkin_text);
  checkin_date.classList.add("checkin_date");

  elapsed_time.appendChild(time_text);
  elapsed_time.classList.add("elapsed_time");

  veicle.appendChild(veicle_description);
  veicle.appendChild(checkin_date);
  veicle.appendChild(elapsed_time);
  veicle.classList.add("veicle");
  veicle.id = plate;
  yard_list.appendChild(veicle);
}

/* Método somente para separar os veículos*/

function generate_yard(veicles)
{
  for (let i in veicles){
    create_veicle(veicles[i].plate, veicles[i].model, 
                  veicles[i].color, veicles[i].checkin_date, veicles[i].elapsed_time);
  }
}

/*Método de abertura da caixa de checkout*/

function open_checkout(data)
{
  checkout_section = document.getElementById("checkout_section");
  checkout_section.classList.remove("hidden");
  checkout_section.classList.add("checkout_section");

  veicle_description = document.getElementById("veicle_description");
  veicle_checkin_date = document.getElementById("checkin_date");
  veicle_elapsed_time = document.getElementById("elapsed_time");

  time = convert_time(data.elapsed_time);

  veicle_description.innerHTML = data.plate + " / " + data.model + " " + data.color;
  veicle_checkin_date.innerHTML = `Entrada: ${organizedate(data.checkin_date)}`;
  veicle_elapsed_time.innerHTML = `Permanência: ` + time;
  get_price(data.plate);
}

/*Método para colocar o preço na caixa de checkout. Ele é chamdo pelo get_price */

function update_price(data)
{
  veicle_price = document.getElementById("price");
  veicle_price.innerHTML = `Valor: ${data.price} R$`
}

/*Método de fechamento da caixa de checkout */

function close_checkout()
{
  checout_section = document.getElementById("checkout_section");
  checkout_section.classList.add("hidden");
}

/*Método que irá atualizar o texto de permanência dos veiculos toda vez que houver uma busca no pátio ou abertura da caixa de checkout */

function convert_time(seconds)
{
  hours = Math.trunc(seconds / 3600);
  minutes = Math.trunc((seconds % 3600)/60);

  return `${hours} Hora(s) e ${minutes} Minuto(s)`;
}


function clear_input()
{
  form = document.getElementById("input_section");
  form.reset();
}

/*Método que irá atualizar as informações da receita no site */

function update_income(data)
{
  cash = document.getElementById("cash");
  pix = document.getElementById("pix");
  debit = document.getElementById("debit");
  credit = document.getElementById("credit");

  cash.innerHTML = `Dinheiro: ${data.cash} R$`;
  pix.innerHTML = `Pix: ${data.pix} R$`;
  debit.innerHTML = `Débito: ${data.debit} R$`;
  credit.innerHTML = `Crédito: ${data.credit} R$`;
   
}

/*Metodo que ira desencadear o pagamento, a remoção e a atualização da receita ele é iniciado a partir do botão de pagar. 
Ele também irá organizar a estrutura de dados para bandar para o back-end 
Fluxo checkout_veicle -> remove_veicle -> delete_veicle
                      -> close_checkout
                      -> pay_veicle -> update_income

 */

function checkout_veicle()
{
  description_element = document.getElementById("veicle_description");
  text = description_element.innerHTML;
  plate = text.slice(0,7);
  price_text = document.getElementById("price");
  payment_method = document.getElementById("payment_method");
  price = parseInt(price_text.innerHTML.match(/\d+/g));
  remove_veicle(plate);
  close_checkout();
  switch (payment_method.value)
  {
    case 'Dinheiro':
      formData = new FormData();
      formData.append('cash', price);
      formData.append('pix', 0);
      formData.append('debit', 0);
      formData.append('credit', 0);
      pay_veicle(formData);
      break;
    case 'Pix':
      formData = new FormData();
      formData.append('cash', 0);
      formData.append('pix', price);
      formData.append('debit', 0);
      formData.append('credit', 0);
      pay_veicle(formData);
      break;
    case 'Débito':
      formData = new FormData();
      formData.append('cash', 0);
      formData.append('pix', 0);
      formData.append('debit', price);
      formData.append('credit', 0);
      pay_veicle(formData);
      break;
    case 'Crédito':
      formData = new FormData();
      formData.append('cash', 0);
      formData.append('pix', 0);
      formData.append('debit', 0);
      formData.append('credit', price);
      pay_veicle(formData);
      break;
  }
}

function remove_veicle(plate)
{
  delete_veicle(plate);
  veicle = document.getElementById(plate);
  veicle.remove();
}

get_yard();
get_income();