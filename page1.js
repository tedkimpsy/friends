// PouchDB 초기화
const db = new PouchDB('photo_db');

// 테이블 업데이트 함수
function updateTable() {
    db.allDocs({ include_docs: true })
        .then(function (result) {
            const tbody = document.querySelector('#photoTableBody');
            tbody.innerHTML = '';

            result.rows.forEach(function (row) {
                const doc = row.doc;
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${doc.name}</td>
                    <td>${doc.studentId}</td>
                    <td>${doc.photoNumber}</td>
                    <td>
                        <button class="btn btn-print" onclick="printPhoto('${doc._id}')">출력</button>
                    </td>
                    <td>
                        <button class="btn btn-delete" onclick="deletePhoto('${doc._id}')">삭제</button>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(function (err) {
            console.error('데이터 가져오기 중 오류 발생:', err);
        });
}

// 페이지 로드 시 테이블 업데이트
updateTable();

// 폼 제출 처리
const photoForm = document.getElementById('photoForm');
photoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const studentId = document.getElementById('studentId').value;
    const photoNumber = document.getElementById('photoNumber').value;

    // DB에 데이터 추가
    db.put({
        _id: new Date().toISOString(),
        name,
        studentId,
        photoNumber
    })
        .then(function (response) {
            console.log('데이터가 성공적으로 추가되었습니다.', response);
            // 데이터 추가 후에 테이블 업데이트
            updateTable();
        })
        .catch(function (err) {
            console.error('데이터 추가 중 오류 발생:', err);
        });

    // 폼 초기화
    document.getElementById('name').value = '';
    document.getElementById('studentId').value = '';
    document.getElementById('photoNumber').value = '';
});

// 사진 출력 함수
function printPhoto(id) {
    // 여기에 사진 출력 로직 추가
    alert('사진 출력: ' + id);
}

// 사진 삭제 함수
function deletePhoto(id) {
    db.get(id)
        .then(function (doc) {
            return db.remove(doc);
        })
        .then(function () {
            console.log('데이터가 삭제되었습니다.');
            // 데이터 삭제 후에 테이블 업데이트
            updateTable();
        })
        .catch(function (err) {
            console.error('데이터 삭제 중 오류 발생:', err);
        });
}

// 검색 버튼 클릭 이벤트 추가
document.getElementById('searchButton').addEventListener('click', function () {
    search();
});

// 초기화 버튼 클릭 이벤트 추가
document.getElementById('resetButton').addEventListener('click', function () {
    resetSearch();
});

// 엔터 키 입력에 대한 이벤트 처리
document.getElementById('searchInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

// 검색 함수
function search() {
    var searchInput = document.getElementById('searchInput').value.toLowerCase(); // 입력된 검색어를 소문자로 변경
    var rows = document.querySelectorAll('#photoTableBody tr'); // 모든 행 가져오기

    rows.forEach(function (row) {
        var nameCell = row.cells[0]; // 이름 열 셀
        var name = nameCell.textContent.toLowerCase(); // 해당 행의 이름을 소문자로 변경

        // 이름에 검색어가 포함되어 있으면 해당 행 표시, 아니면 숨김
        if (name.includes(searchInput)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// 검색 초기화 함수
function resetSearch() {
    var rows = document.querySelectorAll('#photoTableBody tr'); // 모든 행 가져오기

    rows.forEach(function (row) {
        row.style.display = 'table-row'; // 모든 행을 다시 표시
    });

    document.getElementById('searchInput').value = ''; // 검색창 초기화
}