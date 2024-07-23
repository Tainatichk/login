// Função para abrir o modal com a foto em tamanho maior
function openModal(imageUrl) {
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById('modalImg');
    modal.style.display = 'block';
    modalImg.src = imageUrl;
  }
  
  // Função para fechar o modal
  function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
  }
  