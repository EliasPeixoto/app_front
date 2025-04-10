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
      create_veicle(data.plate, data.model, data.color, data.checkin_date);
    })
    alert("Veículo adicionado com sucesso!");
  }
}  
const get_yard = async () =>{
  
  let url = 'http://127.0.0.1:5000/yard';
  let requisition = await fetch(url,{
    method: 'get',
  })
  if (!requisition.ok)
  {
    let error = await requisition.json();

  }
  else
  {
    let response = requisition.json();
    response.then((data) =>{
        generate_yard(data.yard);
    })
  }
}

get_yard();

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

function organizedate(date)
{ 
  new_date = new Date(date);
  return `${String(new_date.getUTCDate()).padStart(2,0)}/
          ${String(new_date.getUTCMonth()+1).padStart(2,0)}/
          ${new_date.getUTCFullYear()} às ${new_date.getUTCHours()}:
          ${new_date.getUTCMinutes()}:${new_date.getUTCSeconds()}`;
}

function create_veicle(plate, model, color, date)
{
  yard_list = document.getElementById("yard_list");
  veicle = document.createElement("li");

  veicle.addEventListener("click", function() {
    checkout_veicle(plate);
  });

  veicle_description = document.createElement("p");
  checkin_date = document.createElement("p");
  elapsed_time = document.createElement("p");

  text = document.createTextNode(plate + " / " + model + " " + color);
  checkin_text = document.createTextNode('Entrada: ' + organizedate(date));
  time_text = document.createTextNode("Permanência: 0 Minutos")
  
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
  yard_list.appendChild(veicle);
}

function generate_yard(veicles)
{
  for (let i in veicles){
    create_veicle(veicles[i].plate, veicles[i].model, 
                  veicles[i].color, veicles[i].checkin_date);
  }
}

function checkout_veicle(plate)
{
  checkout_section = document.getElementById("checkout_section");
  checkout_section.classList.remove("hidden");
  checkout_section.classList.add("checkout_section");
  veicle_description = document.getElementById("veicle_description");
  veicle_description.innerHTML = plate;
}
