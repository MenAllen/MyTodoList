/**
 * Manage Data function : Import / Export TodoList
 *
 * @param {event} event
 * @param {object} dataFile
 */
export function manageData(event, dataFile) {

	// Export function allows user to copy TodoList to clipboard to build a JSON backup file
	function manageExport() {
		const modal = document.getElementById("exportModal");
		modal.style.display = "block";

		// Display data
		const div = document.getElementById("dataDisplay");
		div.innerText = localStorage.getItem('todos')

		// Activate copyClip button to copy data to clipboard
		const btnCopy = document.getElementsByClassName("copyClip")[0];
		btnCopy.textContent = "Copy to Clipboard";
		btnCopy.onclick = function () {
			navigator.clipboard.writeText(div.innerText);
			btnCopy.textContent = "Copied to Clipboard";
		};

		// Get the button element that closes the modal
		const btnClose = document.getElementsByClassName("eclose")[0];
		btnClose.onclick = function () {
			modal.style.display = "none";
		};

		// Get the div that will include the data
		const myInput = document.getElementById("dataDisplay");
		myInput.value = JSON.stringify(dataFile);

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	}

	// Import function allows user to import TodoList from JSON file
	function manageImport() {

		// Display Modal
		const modal = document.getElementById("importModal");
		modal.style.display = "block";

		// Get the OK <button> element that saves the data & closes the modal
		const icloseBtn = document.getElementsByClassName("iclose")[0];

		// When the user clicks on OK, register the value selected and close the modal
		icloseBtn.onclick = function (event) {
			event.preventDefault()
			const fileObject = document.getElementById("inputFile").files[0]

			var reader = new FileReader();
			reader.readAsText(fileObject)

			reader.onload = function() {
				localStorage.setItem("todos", reader.result)	
				modal.style.display = "none";
				location.reload();
			};
		
			reader.onerror = function() {
				alert(reader.error);
			};


		};

		// Get the CANCEL <button> element that closes the modal
		const icancelBtn = document.getElementsByClassName("icancel")[0];

		// When the user clicks on CANCEL, just close the modal
		icancelBtn.onclick = function (event) {
			event.preventDefault()
			modal.style.display = "none";
		};

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function (event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	}

	/* =======================Main manageData ========================================= */

	event.preventDefault();

	const action = event.currentTarget.getAttribute("data-filter");
	event.currentTarget.parentElement.querySelector(".active").classList.remove("active");
	event.currentTarget.classList.add("active");

	if (action === "export") {
		manageExport();
	}

	if (action === "import") {
		manageImport();
	}
}
