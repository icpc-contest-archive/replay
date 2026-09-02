document.write(`
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
    integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
    crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"
    integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ"
    crossorigin="anonymous"></script>
 <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
   integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
   crossorigin="anonymous"></script>
  <script language="javascript" type="text/javascript" src="sidebar.js"></script>
  <div id="fb-root"></div>
  <script async defer src="https://connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v3.2"></script>

  <div class="wrapper">
    <nav class="bg-light border-right px-0 sidebar" id="sidebar-wrapper">
      <div class="list-group list-group-flush">
        <a class="navbar-brand text-center" href="index.html">
          <img src="imagens/logonovo.jpg" alt="Logo da Maratona">
        </a>
        <a class="list-group-item list-group-item-action bg-light" href="./sobre22.html">
          <i class="fas fa-info-circle"></i>
          Sobre
        </a>
        <a class="list-group-item list-group-item-action bg-light" href="./participacao22.html">
          <i class="fa fa-code" aria-hidden="true"></i>
          Como Participar?
        </a>
        <a class="list-group-item list-group-item-action bg-light" href="./inscr22.html">
          <i class="fa fa-check-square" aria-hidden="true"></i>
          Inscreva-se
        </a>
        <a class="list-group-item list-group-item-action bg-light" href="./antigas22.html">
          <i class="fas fa-archive"></i>
          Competições Passadas
        </a>
        <a class="list-group-item list-group-item-action bg-light" href="./sedes22.html">
          <i class="fas fa-university"></i>
          Sedes da primeira fase
        </a>  

        <a class="list-group-item list-group-item-action bg-light" href="./final22.html">
          <img src="imagens/logomdp.jpg" height=40 alt="Logo da final brasileira">
          Final Brasileira
        </a>

       <a class="list-group-item list-group-item-action bg-light" href="./datas22.html">
          <i class="fas fa-calendar-alt"></i> 
          Datas importantes
        </a>

    </nav> 

    <main role="main">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <button type="button" id="sidebarCollapse" class="btn btn-default">
            <i class="fas fa-align-left"></i>
          </button>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a href="./divulga22.html" class="nav-link">
                <i class="fa fa-bullhorn" aria-hidden="true"></i>
                Divulgação
              </a>
            </li>
            <li class="nav-item">
              <a href="https://www.facebook.com/maratona/" target="_blank" class="nav-link">
                <i class="fab fa-facebook-square"></i>
                Página
              </a>
            </li>
            <li class="nav-item"> 
               <a href="https://www.youtube.com/channel/UCuLfhw7dJoKYbzBktNRgAkA" target="_blank" class="nav-link">
               <img src="imagens/youtube.png" height=30>  
                Youtube 
               </a>
            </li>
    <li class="nav-item">
              <a href="./contato22.html" class="nav-link">
                <i class="fas fa-phone"></i>
                Contato
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="d-flex flex-column justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h2 class="display-5 my-5 text-center">
          <span style="color:green">
            Primeira Fase: 8 de outubro de 2022 <br>
            Final Brasileira: Campo Grande, 16 a 18 de mar&ccedil;o de 2023 <br>
          </span>
        </h2>
      </div>
`)
