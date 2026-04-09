const JPDB_BASE_URL = "http://api.login2explore.com:5577";
const JPDB_IRL = "/api/irl";
const JPDB_IML = "/api/iml";

const DB_NAME = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";

let recNo = null;

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

const tokenInput = document.getElementById("connectionToken");

const dataInputs = [
  fullNameInput,
  classInput,
  birthDateInput,
  addressInput,
  enrollmentDateInput,
];

async function init() {
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
  const savedToken = tokenInput.value;
  form.reset();
  tokenInput.value = savedToken;
  recNo = null;
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

function getToken() {
  return tokenInput.value.trim();
}

function isTokenConfigured() {
  const token = getToken();
  return token && token.length > 10;
}

function executeRequest(requestString, apiPath) {
  jQuery.ajaxSetup({ async: false });
  const response = executeCommandAtGivenBaseUrl(requestString, JPDB_BASE_URL, apiPath);
  jQuery.ajaxSetup({ async: true });
  return response;
}

function parseResponseData(response) {
  if (!response || response.data == null) {
    return null;
  }

  if (typeof response.data === "string") {
    try {
      return JSON.parse(response.data);
    } catch (error) {
      return null;
    }
  }

  return response.data;
}

function getResponseMessage(response) {
  const parsed = parseResponseData(response);
  if (parsed && parsed.message) {
    return parsed.message;
  }

  if (response && response.status != null) {
    return `JPDB request failed (status ${response.status}).`;
  }

  return "JPDB request failed.";
}

function getFormData() {
  return {
    "Roll-No": rollNoInput.value.trim(),
    "Full-Name": fullNameInput.value.trim(),
    Class: classInput.value.trim(),
    "Birth-Date": birthDateInput.value,
    Address: addressInput.value.trim(),
    "Enrollment-Date": enrollmentDateInput.value,
  };
}

function validateFormData(data) {
  if (!data["Roll-No"]) return { ok: false, field: rollNoInput, msg: "Roll No is required." };
  if (!data["Full-Name"]) return { ok: false, field: fullNameInput, msg: "Full Name is required." };
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

async function checkRollNo() {
  const rollNo = rollNoInput.value.trim();
  clearMessage();

  if (!isTokenConfigured()) {
    showMessage("Enter JPDB Token first.", "error");
    return;
  }

  if (!rollNo) {
    setDataInputsDisabled(true);
    setButtons({ save: false, update: false, reset: false });
    return;
  }

  try {
    const keyJson = JSON.stringify({ "Roll-No": rollNo });
    const getRequest = createGET_BY_KEYRequest(getToken(), DB_NAME, REL_NAME, keyJson);
    const response = executeRequest(getRequest, JPDB_IRL);

    if (response.status === 200) {
      const parsed = parseResponseData(response);
      const record = parsed && parsed.record ? parsed.record : {};
      recNo = parsed && parsed.rec_no != null ? parsed.rec_no : null;

      fillForm(record);

      rollNoInput.disabled = true;
      setDataInputsDisabled(false);
      setButtons({ save: false, update: true, reset: true });
      fullNameInput.focus();
      showMessage("Record found. You can update the details.", "success");
    } else if (response.status === 400) {
      recNo = null;
      fullNameInput.value = "";
      classInput.value = "";
      birthDateInput.value = "";
      addressInput.value = "";
      enrollmentDateInput.value = "";

      setDataInputsDisabled(false);
      setButtons({ save: true, update: false, reset: true });
      fullNameInput.focus();
      showMessage("New Roll No. Enter details and click Save.", "success");
    } else {
      setDataInputsDisabled(true);
      setButtons({ save: false, update: false, reset: false });
      showMessage(getResponseMessage(response), "error");
    }
  } catch (error) {
    showMessage("Error while checking Roll No.", "error");
    console.error(error);
  }
}

async function onSave() {
  if (!isTokenConfigured()) {
    showMessage("Enter JPDB Token first.", "error");
    return;
  }

  const data = getFormData();
  const validation = validateFormData(data);

  if (!validation.ok) {
    showMessage(validation.msg, "error");
    validation.field.focus();
    return;
  }

  try {
    const keyJson = JSON.stringify({ "Roll-No": data["Roll-No"] });
    const getRequest = createGET_BY_KEYRequest(getToken(), DB_NAME, REL_NAME, keyJson);
    const existingResponse = executeRequest(getRequest, JPDB_IRL);

    if (existingResponse.status === 200) {
      showMessage("Roll No already exists. Use Update.", "error");
      return;
    }

    if (existingResponse.status !== 400) {
      showMessage(getResponseMessage(existingResponse), "error");
      return;
    }

    const putRequest = createPUTRequest(getToken(), JSON.stringify(data), DB_NAME, REL_NAME);
    const saveResponse = executeRequest(putRequest, JPDB_IML);
    if (saveResponse.status !== 200) {
      showMessage(getResponseMessage(saveResponse), "error");
      return;
    }

    showMessage("Record saved successfully.", "success");
    resetForm();
  } catch (error) {
    showMessage("Error while saving record.", "error");
    console.error(error);
  }
}

async function onUpdate() {
  if (!isTokenConfigured()) {
    showMessage("Enter JPDB Token first.", "error");
    return;
  }

  const data = getFormData();
  const validation = validateFormData(data);

  if (!validation.ok) {
    showMessage(validation.msg, "error");
    validation.field.focus();
    return;
  }

  try {
    if (recNo == null) {
      showMessage("No record selected for update. Enter Roll No first.", "error");
      return;
    }

    const updateRequest = createUPDATERecordRequest(
      getToken(),
      JSON.stringify(data),
      DB_NAME,
      REL_NAME,
      recNo
    );
    const updateResponse = executeRequest(updateRequest, JPDB_IML);
    if (updateResponse.status !== 200) {
      showMessage(getResponseMessage(updateResponse), "error");
      return;
    }

    showMessage("Record updated successfully.", "success");
    resetForm();
  } catch (error) {
    showMessage("Error while updating record.", "error");
    console.error(error);
  }
}

init().catch((error) => {
  showMessage("Form initialization failed.", "error");
  console.error(error);
});
