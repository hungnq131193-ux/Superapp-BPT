import { FAQItem, LocationInfo } from './types';

const BASE_IMG_URL = 'https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main';

export const faqs: FAQItem[] = [
  {
    id: '1',
    title: 'Hướng dẫn quên mật khẩu IPay',
    videoLink: 'https://www.youtube.com/embed/86r0pxPOzbs',
    steps: [
      { text: 'Bước 1: Ở màn hình đăng nhập, chọn Quên mật khẩu.', image: `${BASE_IMG_URL}/1.1.png` },
      { text: 'Bước 2: Nhập tên đăng nhập và số điện thoại đăng ký sau đó bấm "Tiếp tục".', image: `${BASE_IMG_URL}/1.2.png` },
      { text: 'Bước 3: Nhập mã OTP được gửi về tin nhắn SMS, sau đó bấm Tiếp tục.', image: `${BASE_IMG_URL}/1.3.png` },
      { text: 'Bước 4: Xác thực khuôn mặt theo yêu cầu. Sau khi hoàn thành Ipay sẽ gửi mật khẩu mới về tin nhắn (SMS). Bấm đăng nhập Ipay để tiếp tục.', image: `${BASE_IMG_URL}/1.4.png` },
      { text: 'Bước 5: Nhập mật khẩu theo yêu cầu.\nMật khẩu hiện tại: Nhập theo mật khẩu được gửi về tin nhắn (SMS).\nMật khẩu mới: Là mật khẩu mà khách hàng cần đổi.\nBấm Tiếp tục.', image: `${BASE_IMG_URL}/1.5.png` },
      { text: 'Bước 6: Thực hiện quét khuôn mặt để xác nhận đổi mật khẩu thành công.', image: `${BASE_IMG_URL}/1.6.png` }
    ]
  },
  {
    id: '2',
    title: 'Hướng dẫn đóng thẻ',
    videoLink: 'https://www.youtube.com/embed/acdT3KxET40',
    steps: [
      { text: 'Bước 1: Đăng nhập vào App VietinBank Ipay.', image: `${BASE_IMG_URL}/2.1.png` },
      { text: 'Bước 2: Vào mục danh sách thẻ.', image: `${BASE_IMG_URL}/2.2.png` },
      { text: 'Bước 3: Xem đúng thẻ cần đóng, bấm vào phần xem thêm.', image: `${BASE_IMG_URL}/2.3.png` },
      { text: 'Bước 4: Chọn đóng thẻ.', image: `${BASE_IMG_URL}/2.4.png` },
      { text: 'Bước 5: Nhập mã OTP.', image: `${BASE_IMG_URL}/2.5.png` },
      { text: 'Bước 6: Xác nhận OTP.', image: `${BASE_IMG_URL}/2.6.png` }
    ]
  },
  {
    id: '3',
    title: 'Xác thực CCCD gắn chip',
    steps: [
      { text: 'Tính năng này đang được cập nhật chi tiết. Quý khách vui lòng làm theo hướng dẫn trên màn hình ứng dụng Ipay.', image: `` }
    ]
  },
  {
    id: '4',
    title: 'Hướng dẫn cập nhật sinh trắc học',
    videoLink: 'https://www.youtube.com/embed/9yYn3SbMT9A',
    steps: [
      { text: 'Bước 1: Đăng nhập VietinBank Ipay.', image: `${BASE_IMG_URL}/3.1.png` },
      { text: 'Bước 2: Click vào "Bắt đầu chụp".', image: `${BASE_IMG_URL}/3.2.png` },
      { text: 'Bước 3: Chụp mặt trước căn cước công dân.', image: `${BASE_IMG_URL}/3.3.png` },
      { text: 'Bước 4: Chụp mặt sau căn cước công dân.', image: `${BASE_IMG_URL}/3.4.png` },
      { text: 'Bước 5: Click vào nút "Đã hiểu".', image: `${BASE_IMG_URL}/3.5.png` },
      { text: 'Bước 6: Đưa gương mặt vào khung hình.', image: `${BASE_IMG_URL}/3.6.png` },
      { text: 'Bước 7: Đặt mặt trước CCCD ngay mặt sau điện thoại để đọc NFC.', image: `${BASE_IMG_URL}/3.7.png` },
      { text: 'Bước 8: Bấm tiếp tục.', image: `${BASE_IMG_URL}/3.8.png` }
    ]
  }
];

export const locations: LocationInfo[] = [
  {
    id: '1',
    name: 'Trụ sở chính',
    address: 'Số 3769 đường Hùng Vương, Khu 1, Phường Vân Phú, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1857.7846301743398!2d105.34349832652241!3d21.36747892312532!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134924582a965d3%3A0x1d0abdf50c3cf7a7!2zTmfDom4gaMOgbmcgVGjGsMahbmcgTeG6oWkgQ-G7lSBQaOG6p24gQ8O0bmcgVGjGsMahbmcgVmnhu4d0IE5hbSBDaGkgTmjDoW5oIFBvw6MgVGjhu40!5e0!3m2!1svi!2s!4v1781584247164!5m2!1svi!2s'
  },
  {
    id: '2',
    name: 'PGD Phong Châu - CN Bắc Phú Thọ',
    address: 'Khu 9, Xã Lâm Thao, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475684.4200053823!2d104.7161865234375!3d21.339269333668994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313491e0b40bc9b9%3A0xfa2e41f5465e7c9!2zQ8OUTkcgVGFkgVE5ISCBYRCBWw4AgUENDQyBE4bqmVSBLSMONIFRIxIJORyBMT05H!5e0!3m2!1svi!2s!4v1781584685740!5m2!1svi!2s'
  },
  {
    id: '3',
    name: 'PGD Tam Nông - CN Bắc Phú Thọ',
    address: 'Khu 24, Xã Vạn Xuân, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237934.68131945547!2d105.01252453234414!3d21.28217656649342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31348f0064e188a7%3A0xbdf062d2a79ff0b7!2zVGnhu4dtIGLDoW5oIELhuqNvIFnhur9u!5e0!3m2!1svi!2s!4v1781593135548!5m2!1svi!2s'
  },
  {
    id: '4',
    name: 'PGD Bãi Bằng - CN Bắc Phú Thọ',
    address: 'Số 220 Khu Đường Nam, Xã Phù Ninh, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59432.8848387123!2d105.26901319158715!3d21.407407714907443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313493e01fee00bf%3A0x3257d9a3cbbf9ada!2sVietinBank!5e0!3m2!1svi!2s!4v1781593208853!5m2!1svi!2s'
  },
  {
    id: '5',
    name: 'PGD Vân Cơ - CN Bắc Phú Thọ',
    address: 'Số 2989 đường Hùng Vương, Phường Nông Trang, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475682.34555091604!2d104.78828430175783!3d21.339908902769686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134928687faeb61%3A0x3d23067589c5863c!2sVietinbank%20-%20Atm!5e0!3m2!1svi!2s!4v1781593305579!5m2!1svi!2s'
  },
  {
    id: '6',
    name: 'PGD Văn Lang - CN Bắc Phú Thọ',
    address: 'Số 2375 đường Hùng Vương, Khu 8, Phường Nông Trang, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475721.7515959704!2d104.80270385742189!3d21.327756612981435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31348d61a58e0c07%3A0x6d783b954769fa5c!2zMjM3NSDEkC4gSMO5bmcgVsawxqFuZywgTmcgNDIsIE7DtG5nIFRyYW5nLCBWaeG7h3QgVHLDrSwgUGjDuiBUaOG7jQ!5e0!3m2!1svi!2s!4v1781593339491!5m2!1svi!2s'
  },
  {
    id: '7',
    name: 'PGD Thanh Sơn - CN Bắc Phú Thọ',
    address: 'Số 64, phố Hoàng Sơn, Xã Thanh Sơn, Phú Thọ',
    iframeSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d476091.0741268814!2d104.60357666015624!3d21.21353996963236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31348653c0ab0a0f%3A0xecafd51cffc5e24c!2zMTU5IFFMMzIsIFRoYW5oIFPGoW4sIFBow7ogVGjhu40!5e0!3m2!1svi!2s!4v1781593373690!5m2!1svi!2s'
  }
];
