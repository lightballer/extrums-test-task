const serverUrl = "";

const init = async () => {
  const token = sessionStorage.getItem("token");
  if (token) return;

  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  if (!username && !password) {
    alert("Incorrect inputs");
    document.location.reload();
  }

  try {
    const response = await fetch(`${serverUrl}/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    const { token } = data;
    sessionStorage.setItem("token", token);
    document.location.reload()
  } catch (err) {
    alert(err);
  }
};

const counterValueElem = document.getElementById("counterValue");
const incrButton = document.getElementById("incrButton");
const decrButton = document.getElementById("decrButton");
const historyList = document.getElementById("historyList");

async function updateCounterValue() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${serverUrl}/counter`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    counterValueElem.textContent = data.value;
  } catch (error) {
    console.error("Error updating counter value:", error);
  }
}

async function updateHistoryList() {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${serverUrl}/counter/history`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    historyList.innerHTML = data.history
      .map((item) => `<li>${item.value} (Recorded: ${item.record_time})</li>`)
      .join("");
  } catch (error) {
    console.error("Error updating history:", error);
  }
}

async function performCounterAction(action) {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${serverUrl}/counter/${action}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();
    counterValueElem.textContent = data.value;
    updateHistoryList();
  } catch (error) {
    console.error(`Error performing ${action} action:`, error);
  }
}

incrButton.addEventListener("click", () => {
  performCounterAction("increment");
});

decrButton.addEventListener("click", () => {
  performCounterAction("decrement");
});

init();
updateCounterValue();
updateHistoryList();
