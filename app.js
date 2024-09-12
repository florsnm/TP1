document.addEventListener("DOMContentLoaded", function () {
    let rowsPerPage = 5; // Número de alumnos por página por defecto
    let currentPage = 1;// Página actual

    // Función para obtener alumnos del localStorage
    function getStudents() {
        let students = localStorage.getItem("students");
        if (students) {
            return JSON.parse(students);
        } else {
            return [];
        }
    }

    // Función para guardar alumnos en localStorage
    function saveStudents(students) {
        localStorage.setItem("students", JSON.stringify(students));
    }

  // Función para cambiar la cantidad de filas por página
    function changeRowsPerPage() {
        const select = document.getElementById("rowsPerPage");
        rowsPerPage = parseInt(select.value); // Change the number of rows per page
        currentPage = 1; // Reset to the first page to avoid errors
        showStudents(); // Call showStudents with the new value
    }

    // Función para mostrar los botones de paginación
    function showPagination(totalStudents) {
        const totalPages = Math.ceil(totalStudents / rowsPerPage);
        const paginationDiv = document.getElementById("pagination");
        paginationDiv.innerHTML = ''; // Clear pagination

        for (let i = 1; i <= totalPages; i++) {
            let button = document.createElement("button");
            button.innerText = i;
            button.classList.add("page-btn");
            if (i === currentPage) {
                button.classList.add("active");
            }
            button.addEventListener("click", function () {
                currentPage = i;
                showStudents();
            });
            paginationDiv.appendChild(button);
        }
    }

     // Mostrar alumnos en la tabla con paginación
    function showStudents() {
        const students = getStudents();
        const tbody = document.getElementById("studentTableBody");
        tbody.innerHTML = ''; // Clear the table

         // Calcular el rango de alumnos para mostrar
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const studentsPage = students.slice(start, end);

        studentsPage.forEach(student => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${student.id}</td><td>${student.firstName}</td><td>${student.lastName}</td>`;
            tbody.appendChild(tr);
        });

        // Actualizar botones de paginación
        showPagination(students.length);
    }

  // Buscar alumnos y aplicar paginación
    document.getElementById("searchInput")?.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        const students = getStudents();
        const tbody = document.getElementById("studentTableBody");
        tbody.innerHTML = ''; // Clear the table
        const filteredStudents = students.filter(student => 
            student.firstName.toLowerCase().includes(searchText) || student.lastName.toLowerCase().includes(searchText)
        );

        // Calcular el rango de alumnos para mostrar en búsqueda
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const studentsPage = filteredStudents.slice(start, end);

        studentsPage.forEach(student => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${student.id}</td><td>${student.firstName}</td><td>${student.lastName}</td>`;
            tbody.appendChild(tr);
        });

        // Actualizar paginación de búsqueda
        showPagination(filteredStudents.length);
    });

     // Procesar formulario de alta de alumno
    document.getElementById("studentForm")?.addEventListener("submit", function (e) {
        e.preventDefault();  // Evitar que el formulario haga un submit normal y recargue la página
        
        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();

        if (firstName && lastName) {
            const students = getStudents();
            const id = students.length + 1; // Generate unique ID
            const newStudent = { id, firstName, lastName };
            students.push(newStudent);
            saveStudents(students);

            alert("Alumno agregado exitosamente");

            // Clear form fields
            document.getElementById("firstName").value = '';
            document.getElementById("lastName").value = '';
        } else {
            alert("Please complete all fields.");
        }
    });

  // Mostrar alumnos si estamos en la página de alumnos
    if (document.getElementById("studentTableBody")) {
        showStudents();
    }

    // Hacer que la función esté disponible globalmente
    window.changeRowsPerPage = changeRowsPerPage;
});

