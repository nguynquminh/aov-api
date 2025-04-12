<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liên Quân Mobile API - Hướng dẫn sử dụng</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary-color: #ff66b2;
            --secondary-color: #ff99cc;
            --accent-color: #ff3385;
            --white: #ffffff;
            --text-color: #333333;
            --light-gray: #f5f5f5;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Nunito', sans-serif;
            color: var(--text-color);
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #fff9fb;
        }

        h1, h2, h3 {
            font-family: 'Montserrat', sans-serif;
            color: var(--accent-color);
            margin: 1.5rem 0 1rem;
        }

        h1 {
            font-size: 2.2rem;
            border-bottom: 2px solid var(--secondary-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }

        h2 {
            font-size: 1.8rem;
            margin-top: 2rem;
            border-left: 4px solid var(--primary-color);
            padding-left: 0.8rem;
        }

        h3 {
            font-size: 1.4rem;
            margin-top: 1.5rem;
        }

        .badge {
            display: inline-block;
            background-color: var(--primary-color);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            margin-right: 0.5rem;
        }

        .method {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            margin-right: 0.5rem;
        }

        .method-get {
            background-color: #e3f2fd;
            color: #1976d2;
        }

        .method-post {
            background-color: #e8f5e9;
            color: #388e3c;
        }

        .method-put {
            background-color: #fff8e1;
            color: #ffa000;
        }

        .method-delete {
            background-color: #ffebee;
            color: #d32f2f;
        }

        code {
            font-family: 'Courier New', monospace;
            background-color: var(--light-gray);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        pre {
            background-color: var(--light-gray);
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        .endpoint {
            background-color: white;
            border-radius: 8px;
            padding: 1.2rem;
            margin: 1.2rem 0;
            box-shadow: 0 2px 10px rgba(255, 102, 178, 0.1);
            border-left: 3px solid var(--primary-color);
        }

        .endpoint-path {
            font-weight: 600;
            margin: 0.5rem 0;
            font-size: 1.1rem;
        }

        .params-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .params-table th, .params-table td {
            border: 1px solid #ddd;
            padding: 0.8rem;
            text-align: left;
        }

        .params-table th {
            background-color: var(--light-pink);
        }

        .params-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .note {
            background-color: #fff3e0;
            border-left: 4px solid #ffb74d;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 4px 4px 0;
        }

        .note-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #e65100;
        }

        .example-container {
            margin: 1.5rem 0;
        }

        .example-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: -1px;
        }

        .example-tab {
            padding: 0.7rem 1.2rem;
            cursor: pointer;
            border: 1px solid transparent;
            border-bottom: none;
            border-radius: 4px 4px 0 0;
            background-color: #f1f1f1;
            margin-right: 0.3rem;
        }

        .example-tab.active {
            background-color: white;
            border-color: #ddd;
            border-bottom-color: white;
            font-weight: 600;
        }

        .example-content {
            display: none;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 0 4px 4px 4px;
            background-color: white;
        }

        .example-content.active {
            display: block;
        }

        .response-schema {
            margin: 1.5rem 0;
        }

        .response-schema-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
            text-align: center;
            color: #777;
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            h3 {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <h1><i class="fas fa-project-diagram"></i> Liên Quân Mobile API</h1>
    
    <p>API cung cấp dữ liệu về các yếu tố trong game Liên Quân Mobile bao gồm tướng, trang bị, ngọc, phép bổ trợ và huy hiệu.</p>
    
    <div class="badge"><i class="fas fa-tag"></i> Phiên bản 1.0.0</div>
    <div class="badge"><i class="fas fa-code-branch"></i> REST API</div>
    <div class="badge"><i class="fas fa-file-code"></i> JSON</div>
    
    <h2><i class="fas fa-book"></i> Giới thiệu</h2>
    <p>Liên Quân Mobile API là một dịch vụ miễn phí cung cấp dữ liệu về game Liên Quân Mobile (Arena of Valor). API được thiết kế đơn giản, dễ sử dụng với các endpoint RESTful trả về dữ liệu dưới dạng JSON.</p>
    
    <div class="note">
        <div class="note-title"><i class="fas fa-info-circle"></i> Lưu ý</div>
        <p>API hiện đang trong giai đoạn phát triển và có thể có một số thay đổi trong tương lai. Vui lòng kiểm tra thường xuyên để cập nhật các thay đổi mới nhất.</p>
    </div>
    
    <h2><i class="fas fa-plug"></i> Cách sử dụng cơ bản</h2>
    <p>Tất cả các endpoint đều sử dụng phương thức GET và trả về dữ liệu dưới dạng JSON. Dưới đây là ví dụ cơ bản:</p>
    
    <div class="example-container">
        <div class="example-tabs">
            <div class="example-tab active" onclick="switchExampleTab('js-example', this)">JavaScript</div>
            <div class="example-tab" onclick="switchExampleTab('python-example', this)">Python</div>
            <div class="example-tab" onclick="switchExampleTab('curl-example', this)">cURL</div>
        </div>
        
        <div class="example-content active" id="js-example">
            <pre><code>// Lấy danh sách tướng
fetch('https://your-domain.com/api/heroes')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));</code></pre>
        </div>
        
        <div class="example-content" id="python-example">
            <pre><code>import requests

# Lấy danh sách tướng
response = requests.get('https://your-domain.com/api/heroes')
data = response.json()
print(data)</code></pre>
        </div>
        
        <div class="example-content" id="curl-example">
            <pre><code># Lấy danh sách tướng
curl -X GET "https://your-domain.com/api/heroes"</code></pre>
        </div>
    </div>
    
    <h2><i class="fas fa-list"></i> Danh sách Endpoints</h2>
    
    <h3><i class="fas fa-shield-alt"></i> Huy hiệu</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/badges</span>
        </div>
        <p>Lấy tất cả huy hiệu trong game.</p>
        
        <h4>Ví dụ response</h4>
        <pre><code>[
  {
    "id": 1,
    "name": "Huy hiệu Sát thủ",
    "description": "Tăng 5% sát thương",
    "image": "https://example.com/badges/1.png"
  },
  ...
]</code></pre>
    </div>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/badges/search?q={term}</span>
        </div>
        <p>Tìm kiếm huy hiệu theo tên hoặc mô tả.</p>
        
        <h4>Tham số</h4>
        <table class="params-table">
            <tr>
                <th>Tham số</th>
                <th>Kiểu</th>
                <th>Bắt buộc</th>
                <th>Mô tả</th>
            </tr>
            <tr>
                <td>q</td>
                <td>string</td>
                <td>Có</td>
                <td>Từ khóa tìm kiếm</td>
            </tr>
        </table>
    </div>
    
    <h3><i class="fas fa-user"></i> Tướng</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/heroes</span>
        </div>
        <p>Lấy tất cả tướng trong game.</p>
        
        <h4>Ví dụ response</h4>
        <pre><code>[
  {
    "id": 1,
    "name": "Liliana",
    "role": "Pháp sư",
    "difficulty": "Khó",
    "skills": [...],
    "stats": {...}
  },
  ...
]</code></pre>
    </div>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/heroes/search?q={term}</span>
        </div>
        <p>Tìm kiếm tướng theo tên hoặc vai trò.</p>
        
        <h4>Tham số</h4>
        <table class="params-table">
            <tr>
                <th>Tham số</th>
                <th>Kiểu</th>
                <th>Bắt buộc</th>
                <th>Mô tả</th>
            </tr>
            <tr>
                <td>q</td>
                <td>string</td>
                <td>Có</td>
                <td>Từ khóa tìm kiếm</td>
            </tr>
        </table>
    </div>
    
    <h3><i class="fas fa-helmet-battle"></i> Trang bị</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/equipments</span>
        </div>
        <p>Lấy tất cả trang bị trong game.</p>
        
        <h4>Ví dụ response</h4>
        <pre><code>{
  "success": true,
  "count": 1,
  "data": [
    {
      "name": "Thánh kiếm",
      "image": "https://lienquan.garena.vn/wp-content/uploads/2024/05/icon48a62735ee508f6a920e823fafd9b21159eebea8e613f1.png",
      "price": "2120",
      "stats": [
        "+100 Công vật lý+25% Tỷ lệ chí mạng – Nội tại Duy nhấtThánh kiếm: Sau khi đánh chí mạng giúp tăng (3 – 45) tốc chạy trong 1.5 giây (chỉ hữu hiệu khi dùng bởi tướng đánh xa) – Nội tại duy nhấtSát thương chí mạng tăng 40% – Nội tại duy nhất"
      ]
    }
  ],
  "author": "Nguyễn Quang Minh"
}</code></pre>
    </div>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/equipments/search?q={term}</span>
        </div>
        <p>Tìm kiếm trang bị theo tên hoặc thuộc tính.</p>
    </div>
    
    <h3><i class="fas fa-gem"></i> Ngọc</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/runes</span>
        </div>
        <p>Lấy tất cả bảng ngọc trong game.</p>
    </div>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/runes/search?q={term}</span>
        </div>
        <p>Tìm kiếm bảng ngọc theo tên hoặc hiệu ứng.</p>
    </div>
    
    <h3><i class="fas fa-magic"></i> Phép bổ trợ</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/spells</span>
        </div>
        <p>Lấy tất cả phép bổ trợ trong game.</p>
    </div>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/spells/search?q={term}</span>
        </div>
        <p>Tìm kiếm phép bổ trợ theo tên.</p>
    </div>
    
    <h3><i class="fas fa-gamepad"></i> Chế độ chơi</h3>
    
    <div class="endpoint">
        <div>
            <span class="method method-get">GET</span>
            <span class="endpoint-path">/api/gamemodes</span>
        </div>
        <p>Lấy tất cả các chế độ chơi trong game.</p>
    </div>
    
    <h2><i class="fas fa-exclamation-triangle"></i> Giới hạn sử dụng</h2>
    <ul>
        <li>Tối đa 60 requests mỗi phút</li>
        <li>Dữ liệu được cập nhật hàng tuần</li>
        <li>API chỉ hỗ trợ phương thức GET</li>
    </ul>
    
    <h2><i class="fas fa-question-circle"></i> Hỗ trợ</h2>
    <p>Nếu bạn gặp bất kỳ vấn đề gì khi sử dụng API, vui lòng:</p>
    <ul>
        <li>Tạo issue trên GitHub repository</li>
        <li>Liên hệ qua email: example@email.com</li>
    </ul>
    
    <div class="footer">
        <p>Made with <i class="fas fa-heart" style="color: var(--accent-color);"></i> by Nguyễn Quang Minh</p>
        <p>© 2023 Liên Quân Mobile API</p>
    </div>

    <script>
        function switchExampleTab(tabId, element) {
            // Ẩn tất cả các tab content
            document.querySelectorAll('.example-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Bỏ active tất cả các tab
            document.querySelectorAll('.example-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Hiển thị tab được chọn
            document.getElementById(tabId).classList.add('active');
            element.classList.add('active');
        }
    </script>
</body>
</html>
