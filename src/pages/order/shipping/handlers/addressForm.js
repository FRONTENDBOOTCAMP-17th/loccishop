// 탭 전환 공통 함수
export function switchTab(activeTab, inactiveTab, activePanel, inactivePanel) {
  activeTab.classList.add(
    "border-woody-brown",
    "text-woody-brown",
    "font-bold",
  );
  activeTab.classList.remove("border-transparent", "text-gray-400");
  inactiveTab.classList.remove(
    "border-woody-brown",
    "text-woody-brown",
    "font-bold",
  );
  inactiveTab.classList.add("border-transparent", "text-gray-400");
  activePanel.classList.remove("hidden");
  activePanel.classList.add("flex");
  inactivePanel.classList.add("hidden");
  inactivePanel.classList.remove("flex");
}

//폼 열기
export function openAddressForm(address = null) {
  const tabNew = document.getElementById("tab-new");
  const tabSelect = document.getElementById("tab-select");
  const panelNew = document.getElementById("panel-new");
  const panelSelect = document.getElementById("panel-select");

  switchTab(tabNew, tabSelect, panelNew, panelSelect);

  const saveBtn = document.getElementById("save-address-btn");

  if (address) {
    document.getElementById("new-name").value = address.name ?? "";
    document.getElementById("new-phone").value = address.phone ?? "";
    document.getElementById("new-zipcode").value = address.zipCode ?? "";
    document.getElementById("new-address").value = address.address ?? "";
    document.getElementById("new-detail").value = address.detailAddress ?? "";
    document.getElementById("new-default").checked = address.isDefault ?? false;

    saveBtn.textContent = "수정완료";
    saveBtn.dataset.mode = "edit";
    saveBtn.dataset.addressId = address.addressId;
  } else {
    document.getElementById("new-name").value = "";
    document.getElementById("new-phone").value = "";
    document.getElementById("new-zipcode").value = "";
    document.getElementById("new-address").value = "";
    document.getElementById("new-detail").value = "";
    document.getElementById("new-default").checked = false;

    saveBtn.textContent = "배송지 저장";
    saveBtn.dataset.mode = "new";
    delete saveBtn.dataset.addressId;
  }
}

// 일반 입력 필드 생성
function createField(
  id,
  labelText,
  type = "text",
  placeholder = "",
  readonly = false,
) {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-1";

  const label = document.createElement("label");
  label.htmlFor = id;
  label.className = "text-sm font-bold";
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.readOnly = readonly;
  input.className = [
    "border border-gray-300 rounded px-3 py-2 text-sm outline-none",
    readonly ? "bg-gray-50" : "focus:border-woody-brown",
  ].join(" ");

  if (type === "tel") {
    input.addEventListener("input", () => {
      // 숫자만 추출
      let digits = input.value.replace(/[^0-9]/g, "");

      // 010-0000-0000 형식으로 자동 포맷
      if (digits.length <= 3) {
        input.value = digits;
      } else if (digits.length <= 7) {
        input.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else {
        input.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
      }
    });

    input.addEventListener("blur", () => {
      const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
      if (input.value && !phoneRegex.test(input.value)) {
        alert("올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)");
        input.value = "";
        input.focus();
      }
    });
  }

  wrapper.append(label, input);
  return wrapper;
}

function createZipcodeField() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-1";

  const label = document.createElement("label");
  label.htmlFor = "new-zipcode";
  label.className = "text-sm font-bold";
  label.textContent = "우편번호";

  const row = document.createElement("div");
  row.className = "flex gap-2";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "new-zipcode";
  input.placeholder = "우편번호";
  input.readOnly = true;
  input.className =
    "flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-gray-50";

  const searchBtn = document.createElement("button");
  searchBtn.type = "button";
  searchBtn.id = "search-address-btn";
  searchBtn.className =
    "px-4 py-2 border border-gray-300 rounded text-sm hover:bg-cararra transition-colors";
  searchBtn.textContent = "주소 검색";

  searchBtn.addEventListener("click", () => {
    new daum.Postcode({
      oncomplete: (data) => {
        document.getElementById("new-zipcode").value = data.zonecode;
        document.getElementById("new-address").value = data.roadAddress;
      },
    }).open();
  });

  row.append(input, searchBtn);
  wrapper.append(label, row);
  return wrapper;
}

// 기본 배송지 체크박스
function createDefaultCheckbox() {
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "new-default";
  checkbox.className = "cursor-pointer";

  const label = document.createElement("label");
  label.htmlFor = "new-default";
  label.className = "text-sm cursor-pointer";
  label.textContent = "기본 배송지로 설정";

  wrapper.append(checkbox, label);
  return wrapper;
}

// 저장 버튼
function createSaveButton() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "save-address-btn";
  btn.className =
    "w-full py-3 bg-woody-brown text-white text-sm font-bold rounded hover:bg-opacity-90 transition-opacity";
  btn.textContent = "배송지 저장";
  return btn;
}

// 폼 필드 생성
export function createAddressFormFields() {
  const panelNew = document.getElementById("panel-new");
  panelNew.innerHTML = "";

  panelNew.append(
    createField("new-name", "받는 분", "text", "이름을 입력하세요"),
    createField("new-phone", "연락처", "tel", "010-0000-0000"),
    createZipcodeField(),
    createField("new-address", "주소", "text", "주소", true),
    createField("new-detail", "상세주소", "text", "상세주소를 입력하세요"),
    createDefaultCheckbox(),
    createSaveButton(),
  );
}
