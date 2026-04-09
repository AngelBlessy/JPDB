const DB_NAME = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";
const REQUIRED_STUDENT_NAME = "Angel Blessy";
const STORAGE_KEY = `${DB_NAME}_${REL_NAME}`;

let records = {};
let currentRecNo = null;

const form = document.getElementById("enrollmentForm");
const rollNoInput = document.getElementById("rollNo");
const fullNameInput = document.getElementById("fullName");
const classInput = document.getElementById("studentClass");
const birthDateInput = document.getElementById("birthDate");
const addressInput = document.getElementById("address");
const enrollmentDateInput = document.getElementById("enrollmentDate");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const resetBtn = document.getElementById("resetBtn");
const messageEl = document.getElementById("message");

const dataInputs = [
  fullNameInput,
  classInput,
  birthDateInput,
  addressInput,
  enrollmentDateInput,
];

function loadRecordsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    records = stored ? JSON.parse(stored) : {};
  } catch (error) {
    records = {};
    console.error("Error loading records:", error);
  }
}

function saveRecordsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Error saving records:", error);
  }
}

function init() {
  loadRecordsFromStorage();
  bindEvents();
  resetForm();
}

function bindEvents() {
  rollNoInput.addEventListener("blur", checkRollNo);
  rollNoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkRollNo();
    }
  });

  saveBtn.addEventListener("click", onSave);
  updateBtn.addEventListener("click", onUpdate);
  resetBtn.addEventListener("click", resetForm);

  form.addEventListener("submit", (event) => event.preventDefault());
}

function resetForm() {
  form.reset();
  currentRecNo = null;
  rollNoInput.disabled = false;
  setDataInputsDisabled(true);
  setButtons({ save: false, update: false, reset: false });
  clearMessage();
  rollNoInput.focus();
}

function setDataInputsDisabled(disabled) {
  dataInputs.forEach((input) => {
    input.disabled = disabled;
  });
}

function setButtons({ save, update, reset }) {
  saveBtn.disabled = !save;
  updateBtn.disabled = !update;
  resetBtn.disabled = !reset;
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
}

function clearMessage() {
  messageEl.textContent = "";
  messageEl.className = "message";
}

function getFormData() {
  return {
    "Roll-No": rollNoInput.value.trim(),
    "Full-Name": REQUIRED_STUDENT_NAME,
    Class: classInput.value.trim(),
    "Birth-Date": birthDateInput.value,
    Address: addressInput.value.trim(),
    "Enrollment-Date": enrollmentDateInput.value,
  };
}

function validateFormData(data) {
  if (!data["Roll-No"]) return { ok: false, field: rollNoInput, msg: "Roll No is required." };
  if (!data.Class) return { ok: false, field: classInput, msg: "Class is required." };
  if (!data["Birth-Date"]) return { ok: false, field: birthDateInput, msg: "Birth Date is required." };
  if (!data.Address) return { ok: false, field: addressInput, msg: "Address is required." };
  if (!data["Enrollment-Date"]) return { ok: false, field: enrollmentDateInput, msg: "Enrollment Date is required." };
  return { ok: true };
}

function fillForm(record) {
  fullNameInput.value = record["Full-Name"] || "";
  classInput.value = record.Class || "";
  birthDateInput.value = record["Birth-Date"] || "";
  addressInput.value = record.Address || "";
  enrollmentDateInput.value = record["Enrollment-Date"] || "";
}

function checkRollNo() {
  const rollNo = rollNoInput.value.trim();
  clearMessage();

  if (!rollNo) {
    setDataInputsDisabled(true);
    setButtons({ save: false, update: false, reset: false });
    return;
  }

  if (records[rollNo]) {
    const record = records[rollNo];
    currentRecNo = rollNo;
    fillForm(record);

    rollNoInput.disabled = true;
    setDataInputsDisabled(false);
    setButtons({ save: false, update: true, reset: true });
    fullNameInput.focus();
    showMessage("Record found. You can update the details.", "success");
  } else {
    currentRecNo = null;
    fullNameInput.value = "";
    classInput.value = "";
    birthDateInput.value = "";
    addressInput.value = "";
    enrollmentDateInput.value = "";

    setDataInputsDisabled(false);
    setButtons({ save: true, update: false, reset: true });
    fullNameInput.focus();
    showMessage("New Roll No. Enter details and click Save.", "success");
  }
}

function onSave() {
  const data = getFormData();
  const validation = validateFormData(data);

  if (!validation.ok) {
    showMessage(validation.msg, "error");
    validation.field.focus();
    return;
  }

  if (records[data["Roll-No"]]) {
    showMessage("Roll No already exists. Use Update.", "error");
    return;
  }

  records[data["Roll-No"]] = data;
  saveRecordsToStorage();
  showMessage("Record saved successfully.", "success");
  setTimeout(resetForm, 500);
}

function onUpdate() {
  const data = getFormData();
  const validation = validateFormData(data);

  if (!validation.ok) {
    showMessage(validation.msg, "error");
    validation.field.focus();
    return;
  }

  if (currentRecNo == null) {
    showMessage("No record selected for update. Enter Roll No first.", "error");
    return;
  }

  records[data["Roll-No"]] = data;
  saveRecordsToStorage();
  showMessage("Record updated successfully.", "success");
  setTimeout(resetForm, 500);
}

init();
