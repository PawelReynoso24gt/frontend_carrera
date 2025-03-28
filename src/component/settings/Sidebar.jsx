import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  const lastPath =
    pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;
  return (
    <div className="col-lg-3 col-md-2 col-12 crancy-personals__list mg-top-30">
      <div className="crancy-psidebar">
        <h2 className="crancy-psidebar__heading">Información personal</h2>
        {/* <!-- Features Tab List --> */}
        <div
          className="list-group crancy-psidebar__list"
          id="list-tab"
          role="tablist"
          ccc  >
          <Link
            className={`list-group-item ${lastPath === "settings" ? "active" : ""
              }`}
            to=""
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="17"
                height="21"
                viewBox="0 0 17 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.48131 20.3781C6.87614 20.3781 5.27097 20.3908 3.66659 20.3701C3.22093 20.3646 2.75697 20.3224 2.33438 20.1903C0.936126 19.7526 0.125183 18.761 0.03048 17.3134C-0.0896892 15.4695 0.12757 13.6566 1.00377 11.9838C1.68261 10.6882 2.73866 9.92418 4.22605 9.87405C4.54677 9.86291 4.89534 9.99422 5.19218 10.1383C5.78507 10.4263 6.32862 10.8235 6.93264 11.0797C8.30544 11.6615 9.63048 11.4227 10.895 10.7097C11.1139 10.5863 11.3359 10.4582 11.5277 10.2982C12.1707 9.76263 12.8846 9.78173 13.6319 9.99103C14.7062 10.2919 15.4726 10.9755 15.9764 11.9448C16.8987 13.7187 17.1359 15.6334 16.9321 17.5864C16.7634 19.2067 15.362 20.3399 13.6144 20.3678C11.9034 20.3948 10.1923 20.3733 8.48131 20.3733C8.48131 20.3757 8.48131 20.3773 8.48131 20.3781ZM8.50519 19.1828C8.50519 19.182 8.50519 19.1812 8.50519 19.1804C10.1756 19.1804 11.8468 19.1947 13.5165 19.1764C14.9418 19.1605 15.8315 18.2899 15.7941 16.8844C15.7687 15.9486 15.6596 15.0087 15.5013 14.0855C15.3556 13.2308 15.0063 12.4382 14.3975 11.7888C13.6764 11.0192 12.8026 10.9054 11.9328 11.4657C11.7545 11.5803 11.5795 11.7005 11.394 11.8031C10.1454 12.4931 8.82193 12.7661 7.40775 12.4835C6.41456 12.2854 5.55428 11.8023 4.71389 11.2572C4.49743 11.1163 4.16159 11.063 3.90136 11.1028C3.0371 11.2357 2.45455 11.7824 2.06301 12.5369C1.28788 14.0322 1.12076 15.6493 1.23217 17.2903C1.30141 18.3121 1.96751 18.9337 2.98139 19.1191C3.2273 19.1637 3.48116 19.1788 3.73185 19.1796C5.3227 19.1852 6.91355 19.1828 8.50519 19.1828Z"
                  fill="white"
                />
                <path
                  d="M3.46851 4.85228C3.51945 2.07407 5.72308 -0.0515716 8.49572 0.000952618C11.1753 0.052681 13.3319 2.29451 13.2834 4.97962C13.234 7.72122 11.0129 9.858 8.26812 9.80389C5.55914 9.75057 3.41838 7.54296 3.46851 4.85228ZM4.66384 4.92072C4.67418 6.99941 6.30642 8.61732 8.38669 8.61016C10.4526 8.60299 12.0984 6.95007 12.0889 4.89128C12.0793 2.83408 10.42 1.18911 8.35804 1.19389C6.29368 1.19946 4.65429 2.85397 4.66384 4.92072Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Mi información</span>
          </Link>
          {/*<Link
            className={`list-group-item ${
              lastPath === "payment-method" ? "active" : ""
            }`}
            to="payment-method"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="19"
                height="17"
                viewBox="0 0 19 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.52617 16.557C6.76875 16.557 4.01133 16.5562 1.25317 16.5555C0.458822 16.5555 0.00298907 16.1011 0.0022418 15.3098C-0.000747268 11.959 -0.000747268 8.52534 0.0022418 4.81217C0.0022418 4.00213 0.442382 3.55526 1.24046 3.55377C2.19697 3.55153 3.15422 3.55078 4.11072 3.55078C5.25927 3.55078 6.40782 3.55153 7.55637 3.55302C7.79325 3.55302 7.97858 3.61355 8.09216 3.72788C8.17959 3.81606 8.22368 3.93338 8.22293 4.07835C8.22144 4.40341 7.98381 4.5977 7.58776 4.59845C6.85917 4.59995 6.13133 4.60069 5.40274 4.60069L1.05738 4.59995V7.13916H7.39571C7.4256 7.13916 7.45624 7.13841 7.48613 7.13841C7.51602 7.13767 7.54516 7.13767 7.5743 7.13767C7.63483 7.13767 7.68116 7.13991 7.72451 7.14364C8.01818 7.17279 8.21845 7.37829 8.22293 7.65552C8.22667 7.93126 8.02864 8.14722 7.73945 8.18085C7.69536 8.18608 7.64754 8.18832 7.58402 8.18832C7.55562 8.18832 7.52797 8.18758 7.49958 8.18758C7.47043 8.18683 7.44204 8.18683 7.41289 8.18683H1.07457V15.4876H17.9426V14.0006C17.9426 13.1352 17.9419 12.2699 17.9434 11.4046C17.9441 11.1542 18.0114 10.7343 18.4605 10.7283H18.4695C18.7998 10.7283 18.9896 10.9697 18.9903 11.3904C18.9926 12.713 18.9948 14.0088 18.9896 15.3128C18.9866 16.1131 18.5405 16.5547 17.7342 16.5547C14.9984 16.5562 12.2619 16.557 9.52617 16.557Z"
                  fill="white"
                />
                <path
                  d="M14.2429 11.7351C14.1682 11.7351 14.1062 11.7224 14.0636 11.6992C12.8844 11.0536 11.4108 10.1098 10.473 8.52857C9.89382 7.55263 9.60836 6.41604 9.57548 4.95214C9.5695 4.69732 9.571 4.43728 9.57249 4.18619C9.57324 4.06887 9.57399 3.95155 9.57399 3.83348V3.75876H9.57025C9.57025 3.64218 9.571 3.52486 9.57175 3.40829C9.57324 3.08173 9.57548 2.74471 9.56726 2.41293C9.55904 2.08413 9.68832 1.88087 9.98573 1.75458C10.4094 1.57449 10.8324 1.39291 11.2553 1.21057C12.1536 0.824984 13.0817 0.425943 14.0008 0.0478251C14.0755 0.0171872 14.1727 0 14.2743 0C14.3864 0 14.4955 0.019429 14.5822 0.0552978C15.5133 0.439393 16.4541 0.843665 17.3635 1.23523C17.7625 1.40711 18.1623 1.57898 18.5621 1.74935C18.8558 1.87489 18.9858 2.02883 18.9836 2.24853C18.9798 2.62216 18.9858 3.00252 18.9911 3.37018C19.0075 4.43055 19.0239 5.52679 18.8177 6.59314C18.5016 8.22517 17.6146 9.5598 16.1059 10.6725C15.6313 11.0229 15.1292 11.3495 14.6128 11.6432C14.5149 11.6992 14.37 11.7351 14.2429 11.7351ZM14.3027 1.11492C14.2123 1.11492 14.1069 1.13734 14.0128 1.17695C13.4867 1.39814 12.9539 1.6268 12.4383 1.84799C11.9421 2.06096 11.4295 2.28066 10.9236 2.49363C10.7263 2.57658 10.606 2.68045 10.6119 2.93975C10.6217 3.3216 10.6209 3.71018 10.6202 4.08606C10.6194 4.42009 10.6187 4.76607 10.6254 5.10608C10.6643 7.12669 11.4848 8.71239 13.066 9.81686C13.2984 9.97901 13.4792 10.1158 13.6249 10.2256C13.9425 10.4655 14.1017 10.5858 14.281 10.5858C14.4619 10.5858 14.627 10.461 14.9551 10.2137C15.1023 10.1023 15.2854 9.96407 15.5185 9.80042C16.8001 8.89921 17.5466 7.79849 17.7379 6.52888C17.8702 5.65009 17.9142 4.74739 17.9568 3.87384C17.9755 3.49348 17.9949 3.09967 18.0211 2.71557L18.0248 2.66251L17.1819 2.30084C16.2404 1.89657 15.3511 1.51471 14.4529 1.14108C14.4103 1.12389 14.3595 1.11492 14.3027 1.11492Z"
                  fill="white"
                />
                <path
                  d="M3.42928 11.7744C3.28506 11.7744 3.14159 11.7736 2.99736 11.7706C2.6312 11.7639 2.40104 11.5666 2.39656 11.2557C2.39432 11.113 2.4414 10.9882 2.53182 10.8948C2.63718 10.7872 2.79187 10.7289 2.97943 10.7267C3.3568 10.7229 3.73865 10.7207 4.11453 10.7207C4.4919 10.7207 4.87375 10.7229 5.24963 10.7267C5.43645 10.7289 5.59113 10.7865 5.6965 10.8948C5.78766 10.9882 5.83399 11.113 5.83175 11.2565C5.82652 11.5666 5.59561 11.7639 5.22945 11.7706C5.08598 11.7736 4.94175 11.7744 4.79828 11.7744C4.68395 11.7744 4.57036 11.7736 4.45678 11.7736C4.34245 11.7729 4.22886 11.7729 4.11453 11.7729C4.0002 11.7729 3.88661 11.7736 3.77228 11.7736C3.6572 11.7736 3.54287 11.7744 3.42928 11.7744Z"
                  fill="white"
                />
                <path
                  d="M13.6852 7.59769C13.5193 7.59769 13.3579 7.50279 13.242 7.33765C12.8781 6.81904 12.4925 6.2414 12.0636 5.57036C11.8932 5.30358 11.9418 5.01887 12.1884 4.84625C12.2818 4.7805 12.3857 4.74537 12.488 4.74537C12.6562 4.74537 12.8139 4.83654 12.9334 5.00169C13.103 5.23708 13.263 5.47919 13.4326 5.73476C13.5088 5.84984 13.5865 5.96716 13.6672 6.08747L13.724 6.17191L15.5018 3.95252C15.5175 3.93235 15.5332 3.91217 15.5489 3.89199C15.587 3.84342 15.6228 3.79709 15.6624 3.75524C15.7887 3.62223 15.9344 3.55273 16.0839 3.55273C16.1937 3.55273 16.3021 3.59234 16.3977 3.66707C16.6354 3.85388 16.6698 4.15279 16.4807 4.39341C15.5518 5.57634 14.7881 6.5291 14.0775 7.39369C13.9691 7.52521 13.8301 7.59769 13.6852 7.59769Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Payment Method</span>
          </Link>*/}
          {/*  <Link
            className={`list-group-item ${
              lastPath === "notification-setting" ? "active" : ""
            }`}
            to="notification-setting"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5723 20.0005C13.4472 20.0005 13.3221 20.0005 13.1978 20.0013C12.8673 20.0013 12.6816 19.8493 12.6092 19.5226C12.5816 19.3974 12.5565 19.2714 12.5321 19.1446C12.5022 18.9903 12.4707 18.8313 12.4345 18.6746C12.3314 18.2337 12.0434 17.9809 11.6452 17.9809C11.5469 17.9809 11.4422 17.9967 11.3344 18.0282C11.1802 18.073 11.0267 18.125 10.878 18.1746C10.793 18.2029 10.708 18.2321 10.623 18.2596C10.446 18.3163 10.3248 18.3423 10.2296 18.3423C10.0376 18.3423 9.91719 18.2407 9.71574 17.9093C9.68584 17.8597 9.65357 17.8108 9.61187 17.7463L9.53318 17.625L9.43481 17.4723L9.39075 17.6486C8.98077 19.2761 8.25761 20.0013 7.04499 20.0021C7.02138 20.0021 6.99778 20.0021 6.97338 20.0013C5.79697 19.9745 5.03524 19.1982 4.71104 17.6951L4.69766 17.6329H1.93563C1.80265 17.6329 1.6736 17.6337 1.54454 17.6345C1.41549 17.6353 1.28644 17.636 1.15739 17.636C0.957515 17.636 0.793052 17.6345 0.639606 17.6313C0.231991 17.6227 0.0391998 17.4298 0.0336915 17.0243C0.0242486 16.3463 0.013232 15.5779 0.0415605 14.8251C0.0486426 14.6283 0.135989 14.4008 0.25245 14.2708C1.00158 13.4378 1.31241 12.4323 1.23057 11.1064C1.17627 10.2167 1.14008 9.05453 1.35097 7.95301C1.80658 5.57437 3.27573 4.03428 5.7167 3.37447C5.76785 3.36029 5.81978 3.34612 5.87093 3.33037C5.89611 3.3225 5.92051 3.31384 5.95592 3.30124L6.15028 3.23274L6.04877 3.14377C5.49401 2.65796 5.26581 2.11389 5.35079 1.47849C5.40745 1.05567 5.6026 0.698205 5.93152 0.416328C6.24235 0.146261 6.63659 -0.000976562 7.04027 -0.000976562C7.50769 -0.000976562 7.94678 0.187992 8.27649 0.532071C8.98785 1.27377 8.89815 2.23357 8.03098 3.16503L7.93577 3.26738L8.07269 3.29573C9.34826 3.56107 10.4208 4.14451 11.2604 5.03187C12.1048 5.92317 12.6281 7.00817 12.8169 8.25614L12.8271 8.32307L14.338 8.32228C14.6567 8.32228 14.973 8.32307 15.2894 8.32386C15.771 8.32622 15.8961 8.427 15.9952 8.89076C16.0141 8.97816 16.0322 9.06634 16.0503 9.15374C16.0826 9.30964 16.1148 9.46632 16.151 9.62144C16.2565 10.082 16.5398 10.3356 16.9497 10.3356C17.0528 10.3356 17.1638 10.319 17.2787 10.286C17.425 10.2435 17.5714 10.1939 17.7122 10.1466C17.8169 10.1112 17.9216 10.0757 18.0262 10.0427C18.1592 10.0009 18.267 9.98126 18.3544 9.98126C18.5479 9.98126 18.6762 10.0757 18.8257 10.3309C19.0067 10.6387 19.1877 10.9544 19.3624 11.2592C19.5331 11.5576 19.7102 11.8662 19.888 12.1678C20.0643 12.4678 20.0249 12.715 19.7645 12.9441C19.5449 13.1378 19.3466 13.3126 19.1483 13.4984C18.9256 13.7071 18.8123 13.9275 18.8115 14.1543C18.8108 14.3779 18.9193 14.596 19.1357 14.8023C19.2506 14.9118 19.371 15.0188 19.4875 15.122C19.5929 15.2157 19.7023 15.3117 19.8062 15.4102C20.0226 15.6141 20.0588 15.8448 19.9148 16.0967C19.5127 16.7999 19.1491 17.4337 18.7722 18.0675C18.6636 18.251 18.5172 18.3439 18.337 18.3439C18.2709 18.3439 18.1985 18.3313 18.123 18.3069L17.9231 18.2407C17.6941 18.1652 17.4581 18.0864 17.222 18.0195C17.1268 17.9927 17.0324 17.9786 16.9419 17.9786C16.5571 17.9786 16.2659 18.2203 16.1628 18.625C16.1188 18.7966 16.0849 18.9722 16.0519 19.1423C16.0306 19.2533 16.0086 19.3635 15.985 19.4738C15.8984 19.8682 15.7458 19.9958 15.3578 19.9981C15.1037 20.0005 14.8487 20.0005 14.5945 20.0005H13.5723ZM5.79696 17.7321C5.87015 18.4762 6.36668 18.9761 7.03161 18.9761C7.07489 18.9761 7.11896 18.9738 7.16303 18.9698C7.82481 18.9045 8.29931 18.3549 8.24423 17.7179L8.23794 17.6463H5.78831L5.79696 17.7321ZM11.6743 16.951C12.5116 16.951 13.1978 17.5274 13.4236 18.4187C13.4512 18.5289 13.4795 18.6384 13.5078 18.7486L13.5629 18.9635H15.0281L15.0431 18.9037C15.0596 18.8384 15.0745 18.773 15.0903 18.7084C15.1233 18.5659 15.1556 18.4321 15.1957 18.2982C15.42 17.5526 15.9079 17.1046 16.6074 17.003C16.6672 16.9943 16.7294 16.9904 16.7979 16.9904C16.9749 16.9904 17.1551 17.0188 17.3455 17.0495C17.4888 17.0723 17.6359 17.0959 17.7823 17.1054C17.8027 17.1069 17.8248 17.1077 17.8476 17.1077C17.9507 17.1077 18.134 17.0928 18.2025 16.9912C18.3646 16.7534 18.5054 16.4999 18.6424 16.2558C18.6919 16.1668 18.7415 16.0794 18.7911 15.992L18.8202 15.9416L18.7809 15.8991C17.4345 14.4567 17.4345 13.9024 18.7801 12.4127L18.8186 12.3701L18.0955 11.1135L18.0357 11.1308C17.9664 11.1513 17.9003 11.171 17.8366 11.1907C17.7036 11.2308 17.5785 11.2694 17.4526 11.3025C17.2936 11.3442 17.1315 11.3655 16.9686 11.3655C16.1723 11.3655 15.4688 10.8615 15.2185 10.112C14.9722 9.37657 14.9345 9.34822 14.2019 9.34822H14.1704C14.157 9.34822 14.1436 9.34901 14.1303 9.34901C14.1185 9.34979 14.1074 9.3498 14.0956 9.3498C14.0846 9.3498 14.0744 9.34979 14.0634 9.34822C14.0114 9.34113 13.965 9.3372 13.9217 9.3372C13.6471 9.3372 13.5007 9.48365 13.4315 9.82615C13.2403 10.7734 12.5502 11.3623 11.6311 11.3623C11.5374 11.3623 11.4414 11.356 11.3454 11.3434C11.2581 11.3324 11.1589 11.3064 11.0637 11.2812C10.9284 11.2458 10.7891 11.2088 10.6671 11.2088C10.5853 11.2088 10.5192 11.2245 10.4633 11.2576C10.2752 11.3678 10.1698 11.5962 10.0667 11.8174C10.0266 11.9032 9.98565 11.9922 9.94158 12.0694C9.90617 12.1316 9.87469 12.1961 9.84086 12.2646C9.82433 12.2977 9.80781 12.3323 9.78971 12.3693L9.7598 12.4284L9.81253 12.4678C10.483 12.9709 10.7946 13.5158 10.7938 14.1819C10.793 14.8905 10.3972 15.3724 9.80387 15.8786L9.7543 15.9212L9.78735 15.9779C9.8385 16.066 9.88964 16.1487 9.93922 16.2298C10.0423 16.3983 10.1399 16.5566 10.2115 16.7227C10.3303 16.9999 10.4822 17.1227 10.7041 17.1227C10.7954 17.1227 10.8985 17.1022 11.0291 17.0589C11.2447 16.988 11.4619 16.951 11.6743 16.951ZM7.12683 4.24766C4.60087 4.24766 2.52502 6.05466 2.2984 8.45141C2.20003 9.49546 2.18351 10.5962 2.24961 11.7237C2.31492 12.8284 2.05446 13.6591 1.43123 14.3362C0.985056 14.8212 1.02047 15.3661 1.05509 15.8928C1.06847 16.0897 1.08106 16.2936 1.06768 16.4865L1.06139 16.5707H8.91152L8.85644 16.4574C8.83992 16.4235 8.82654 16.3952 8.81395 16.3692C8.79034 16.3188 8.77146 16.2802 8.75178 16.2424C8.49919 15.77 8.52201 15.6361 8.91546 15.2834C8.97133 15.233 9.02877 15.1834 9.08543 15.1338C9.22471 15.0118 9.36871 14.8866 9.50091 14.7519C9.86289 14.385 9.86289 13.9291 9.50091 13.5622C9.37422 13.4339 9.2373 13.3134 9.10431 13.1961C9.04136 13.141 8.97841 13.0851 8.91625 13.0292C8.51729 12.667 8.49289 12.5245 8.751 12.0725C9.03664 11.5733 9.34275 11.0434 9.71416 10.4057C9.90066 10.0852 10.025 9.98205 10.2241 9.98205C10.3224 9.98205 10.446 10.0072 10.6238 10.0631C10.8583 10.1364 11.096 10.2057 11.3486 10.2789C11.469 10.3135 11.5933 10.3498 11.7239 10.3883L11.8246 10.4183V10.3135C11.8246 10.134 11.8262 9.96315 11.827 9.79781C11.8294 9.46003 11.8325 9.14036 11.8223 8.82383C11.7452 6.39166 9.72676 4.34057 7.32277 4.25159C7.25903 4.24844 7.19293 4.24766 7.12683 4.24766ZM7.03319 1.02654C6.66334 1.03047 6.36196 1.33755 6.36039 1.71076C6.35881 2.08948 6.65233 2.39104 7.02847 2.39813H7.04027C7.40539 2.39813 7.71307 2.10129 7.72488 1.73674C7.73117 1.54935 7.66192 1.3714 7.53051 1.23598C7.39988 1.10055 7.22598 1.02654 7.04106 1.02654H7.04027H7.03319Z"
                  fill="white"
                />
                <path
                  d="M0.525227 5.5086C0.430012 5.5086 0.333223 5.47395 0.238794 5.40624C0.12548 5.32435 -0.118459 5.10153 0.0680366 4.78658C0.842349 3.47877 1.93614 2.46149 3.31873 1.76152C3.34312 1.74892 3.37854 1.74341 3.43677 1.73317C3.46903 1.72766 3.50759 1.72136 3.55401 1.71191C3.5847 1.73711 3.62011 1.76231 3.65631 1.78908C3.76648 1.8686 3.89081 1.95915 3.9215 2.06229C3.96242 2.19851 3.88294 2.39771 3.81291 2.57329C3.80268 2.59928 3.79245 2.62447 3.783 2.64888C3.77199 2.67644 3.69644 2.71266 3.64687 2.73628C3.61697 2.75045 3.58785 2.76384 3.56267 2.7788C2.53104 3.3646 1.68197 4.15826 1.03829 5.13854L1.01153 5.17948C0.972187 5.24168 0.934416 5.29995 0.887202 5.34325C0.769953 5.45269 0.647197 5.5086 0.525227 5.5086Z"
                  fill="white"
                />
                <path
                  d="M13.4674 5.50621C13.4445 5.49046 13.4186 5.47393 13.3895 5.45503C13.2903 5.39283 13.1668 5.31488 13.0959 5.2078C12.398 4.15273 11.4977 3.31812 10.4213 2.72602C10.1144 2.55673 10.0121 2.28352 10.1545 2.01188C10.2466 1.83629 10.3984 1.74023 10.5826 1.74023C10.6912 1.74023 10.8053 1.77252 10.9233 1.83629C12.1635 2.50949 13.1762 3.45197 13.934 4.63774C14.0615 4.83695 14.0827 5.04954 13.9922 5.2204C13.9025 5.38968 13.7129 5.49283 13.4674 5.50621Z"
                  fill="white"
                />
                <path
                  d="M14.2915 16.1943C13.1796 16.1927 12.2738 15.2825 12.2715 14.1653C12.2707 13.6172 12.4808 13.1031 12.864 12.7189C13.2449 12.3362 13.754 12.126 14.297 12.126H14.3151C15.4222 12.1354 16.3201 13.0527 16.3162 14.17C16.3122 15.2865 15.4057 16.1943 14.2946 16.1943H14.2915ZM14.2812 13.1519C13.7249 13.159 13.2921 13.6054 13.2968 14.17C13.3015 14.7204 13.7477 15.1676 14.2915 15.1676H14.3056C14.8541 15.1597 15.2956 14.7015 15.29 14.1464C15.2845 13.5889 14.847 13.1519 14.293 13.1519H14.2812Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Notificaciones</span>
          </Link>*/}
          {/*<Link
            className={`list-group-item ${
              lastPath === "login-activity" ? "active" : ""
            }`}
            to="login-activity"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.1946 21.3022C13.276 21.3022 12.572 20.5863 12.5207 19.6001C12.5113 19.4162 12.513 19.2348 12.5164 19.0244C12.5181 18.9227 12.519 18.8157 12.519 18.702V18.6182H11.4276C11.2377 18.6182 11.047 18.6182 10.8571 18.619C10.6672 18.619 10.4773 18.6199 10.2874 18.6199C10.0531 18.6199 9.81869 18.619 9.58433 18.6173C8.24145 18.6062 7.24413 17.6679 7.15945 16.3353C7.12951 15.8682 7.14149 15.4004 7.15518 14.9607C7.16801 14.5681 7.39296 14.3244 7.7428 14.3244C7.75135 14.3244 7.7599 14.3244 7.76845 14.3244C8.11315 14.3355 8.31501 14.5715 8.32442 14.9727C8.3287 15.1566 8.32699 15.3448 8.32613 15.5261C8.32442 15.7434 8.32271 15.9683 8.33041 16.1898C8.35693 16.9562 8.84789 17.4361 9.61256 17.4421C9.98036 17.4446 10.3473 17.4455 10.7185 17.4455C10.9939 17.4455 11.2719 17.4446 11.5533 17.4446C11.8424 17.4438 12.135 17.4438 12.4326 17.4438H12.5164V13.3416C12.5164 10.164 12.5164 6.9864 12.5164 3.80968C12.5164 2.65497 12.8842 2.14177 13.9748 1.77739C14.3246 1.66021 14.6856 1.53961 15.0388 1.33604L15.31 1.17951L11.7381 1.17866C11.0607 1.17866 10.3832 1.17866 9.70579 1.17951C8.80085 1.18037 8.33725 1.64225 8.32784 2.55147C8.32613 2.70287 8.32699 2.85512 8.32784 3.00651C8.3287 3.22805 8.33041 3.45728 8.32356 3.68138C8.31244 4.05773 8.11316 4.28182 7.77701 4.29722C7.76589 4.29808 7.75477 4.29808 7.74365 4.29808C7.40323 4.29808 7.16886 4.06286 7.16031 3.71217L7.15859 3.6369C7.14576 3.09889 7.13294 2.54378 7.20393 2.0109C7.35789 0.854483 8.32014 0.0119747 9.4911 0.00855338C11.1257 0.00256601 12.8218 0 14.5333 0C16.1679 0 17.87 0.00256599 19.5944 0.00769802C20.5489 0.010264 21.2973 0.759541 21.2982 1.71239C21.3059 7.68265 21.305 12.9481 21.2965 17.8099C21.2948 18.5865 20.8996 19.1519 20.1828 19.4016C18.1711 20.103 16.3928 20.6958 14.7463 21.215C14.5624 21.2731 14.3768 21.3022 14.1946 21.3022ZM19.6226 1.19149C19.508 1.19149 19.3711 1.21886 19.2035 1.27445C18.6612 1.45493 18.1198 1.63712 17.5775 1.8193C16.4989 2.18197 15.3835 2.55661 14.2836 2.91328C13.8653 3.04843 13.6874 3.28878 13.6874 3.71559C13.6925 7.13609 13.6925 10.613 13.6925 13.9762C13.6925 15.7793 13.6925 17.5823 13.6934 19.3854C13.6934 19.8661 13.8704 20.1099 14.2186 20.1099C14.3289 20.1099 14.4555 20.0859 14.606 20.0363C15.1526 19.855 15.6991 19.6719 16.2457 19.4889C17.32 19.1288 18.4303 18.7567 19.5268 18.4026C19.9596 18.2632 20.1349 18.0211 20.1332 17.5661C20.123 15.6142 20.1238 13.6298 20.1255 11.7104C20.1255 11.0647 20.1264 10.4189 20.1264 9.77395V7.65613C20.1264 5.75044 20.1264 3.84475 20.1255 1.93905C20.1247 1.61744 20.0725 1.19149 19.6226 1.19149Z"
                  fill="white"
                />
                <path
                  d="M5.71744 13.2541C5.5669 13.2541 5.42577 13.1883 5.30858 13.0643C5.06909 12.8094 5.08962 12.4895 5.36418 12.2089C5.75764 11.8069 6.16222 11.4032 6.55482 11.0123C6.7601 10.8079 6.96452 10.6043 7.16895 10.399C7.23139 10.3357 7.29126 10.2716 7.36568 10.1895C7.40588 10.1458 7.45035 10.0971 7.50167 10.0415L7.63254 9.90036H3.63127C2.67329 9.90036 1.71617 9.90036 0.758188 9.8995C0.327953 9.8995 0.0773422 9.73956 0.0131919 9.42394C-0.021877 9.25116 0.0131877 9.09378 0.115828 8.96804C0.240708 8.81494 0.457113 8.72684 0.708582 8.72684C1.60156 8.72513 2.49538 8.72427 3.38835 8.72427L7.68386 8.72513C7.68386 8.72513 6.03904 7.09228 5.57545 6.63211C5.55236 6.60902 5.52927 6.58678 5.50617 6.56454C5.4386 6.49868 5.37445 6.43624 5.31629 6.36781C5.08535 6.0941 5.08962 5.76908 5.32655 5.53984C5.44202 5.4278 5.58572 5.36621 5.73027 5.36621C5.88081 5.36621 6.02536 5.43036 6.14939 5.55267C7.23481 6.6227 8.36214 7.74833 9.49974 8.89876C9.75036 9.15279 9.74266 9.48723 9.48007 9.75153C8.35445 10.884 7.24678 11.9891 6.18702 13.0369C6.04247 13.178 5.87995 13.2541 5.71744 13.2541Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Login Activity</span>
          </Link>*/}
          <Link
            className={`list-group-item ${lastPath === "change-password" ? "active" : ""
              }`}
            to="change-password"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="17"
                height="23"
                viewBox="0 0 17 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.1121 9.15531C2.1121 8.21583 2.09798 7.26128 2.11493 6.30861C2.16388 3.45061 4.04191 0.997406 6.74364 0.245252C10.8358 -0.893805 14.8074 2.07057 14.8837 6.3265C14.9006 7.26598 14.8865 8.20547 14.8865 9.12142C14.9401 9.16473 14.9608 9.19485 14.9872 9.2005C16.5151 9.55445 16.9989 10.1579 16.9989 11.7187C16.9999 14.5729 17.0008 17.4262 16.9989 20.2804C16.998 21.8864 16.2063 22.6828 14.606 22.6837C10.5289 22.6866 6.45182 22.6866 2.37569 22.6837C0.8036 22.6828 0.00343924 21.8789 0.0015565 20.3087C-0.0012676 17.5335 0.000614214 14.7574 0.000614214 11.9822C-0.00126852 10.1155 0.317849 9.68154 2.1121 9.15531ZM8.4607 21.2604C10.4988 21.2604 12.5378 21.2613 14.5758 21.2604C15.4174 21.2594 15.5756 21.106 15.5756 20.2823C15.5765 17.397 15.5765 14.5117 15.5756 11.6264C15.5756 10.8065 15.4061 10.637 14.5787 10.6361C10.5176 10.6342 6.45652 10.6342 2.39545 10.6361C1.59435 10.6361 1.42019 10.8112 1.41925 11.5982C1.41737 14.4995 1.41737 17.3998 1.41925 20.3011C1.41925 21.0947 1.58494 21.2585 2.39169 21.2585C4.41564 21.2613 6.43864 21.2604 8.4607 21.2604ZM13.4613 9.18355C13.4613 8.16405 13.4951 7.1935 13.4547 6.22671C13.352 3.74809 11.539 1.74485 9.18743 1.46903C6.6768 1.17438 4.42222 2.60809 3.74537 4.96151C3.34906 6.34156 3.59005 7.75644 3.52792 9.18449C6.85754 9.18355 10.1279 9.18355 13.4613 9.18355Z"
                  fill="white"
                />
                <path
                  d="M8.53224 12.7619C9.48679 12.7751 10.3105 13.403 10.5486 14.3011C10.8066 15.2697 10.4206 16.2431 9.55268 16.71C9.29287 16.8494 9.18649 16.9981 9.20625 17.2871C9.22885 17.6297 9.21944 17.9762 9.20814 18.3207C9.19119 18.8573 8.94833 19.1378 8.51059 19.1463C8.05779 19.1548 7.80644 18.862 7.78573 18.3C7.78291 18.2219 7.78008 18.1428 7.78573 18.0647C7.82621 17.4085 7.8281 16.8569 7.09477 16.4333C6.35297 16.0049 6.1967 14.9478 6.51771 14.1043C6.83307 13.2731 7.61911 12.7497 8.53224 12.7619ZM9.19684 14.8847C9.19402 14.4649 8.89655 14.173 8.4814 14.1825C8.06438 14.1919 7.78762 14.4912 7.8008 14.9177C7.81398 15.3262 8.07944 15.5842 8.49082 15.5879C8.92008 15.5907 9.19967 15.313 9.19684 14.8847Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Cambiar contraseña</span>
          </Link>
          {/*<Link
            className={`list-group-item ${lastPath === "faq" ? "active" : ""}`}
            to="faq"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.00634294 12.6712C0.00634294 11.3401 -0.00963332 10.0096 0.0091246 8.67852C0.071651 4.25582 3.53145 0.493116 7.93053 0.0477889C12.7458 -0.439222 16.9892 2.84619 17.7034 7.61348C18.4447 12.5649 14.8362 17.2085 9.84869 17.7177C9.49229 17.7539 9.13312 17.7733 8.77533 17.774C6.16034 17.7789 3.54464 17.7768 0.928957 17.7761C0.221714 17.7761 0.00356975 17.5545 0.00356975 16.8368C0.00287501 15.448 0.00356975 14.0593 0.00356975 12.6705C0.00426449 12.6712 0.0056482 12.6712 0.00634294 12.6712ZM1.39443 16.3859C1.51184 16.3859 1.58062 16.3859 1.6487 16.3859C4.10252 16.3852 6.55564 16.388 9.00945 16.3811C9.35543 16.3797 9.70488 16.3519 10.046 16.2977C15.6296 15.414 18.28 8.92654 14.9078 4.40588C12.9778 1.81868 9.64236 0.752253 6.58343 1.74295C3.5238 2.73434 1.41875 5.59041 1.3979 8.81538C1.38193 11.2456 1.39443 13.6765 1.39443 16.1067C1.39443 16.1852 1.39443 16.2644 1.39443 16.3859Z"
                  fill="white"
                />
                <path
                  d="M8.66115 4.84961C9.41146 4.86073 10.0166 4.98161 10.548 5.35329C11.3248 5.89588 11.6124 6.84559 11.1573 7.6765C10.8982 8.15031 10.5244 8.58869 10.118 8.94856C9.61919 9.39042 9.28155 9.85033 9.31351 10.5465C9.33018 10.9091 9.13495 11.0446 8.68962 11.0738C8.26167 11.1022 8.03797 10.9786 7.98517 10.6333C7.84553 9.71833 8.10536 8.94509 8.84386 8.35456C9.06896 8.17393 9.29752 7.99469 9.50039 7.79043C9.7887 7.50003 9.92627 7.14224 9.75953 6.74694C9.59418 6.35511 9.22666 6.26826 8.84178 6.24256C8.32975 6.20852 7.92194 6.369 7.62945 6.81989C7.39046 7.1881 7.11744 7.25201 6.77424 7.08111C6.45535 6.92201 6.31919 6.6073 6.43799 6.22936C6.68045 5.45681 7.28835 5.11222 8.01921 4.93645C8.26515 4.8774 8.5222 4.86767 8.66115 4.84961Z"
                  fill="white"
                />
                <path
                  d="M9.54853 12.8483C9.54714 13.3589 9.13654 13.7681 8.62452 13.7681C8.1132 13.7688 7.70955 13.3589 7.71094 12.842C7.71233 12.3244 8.11806 11.9194 8.63077 11.9229C9.14349 11.9263 9.54992 12.3362 9.54853 12.8483Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">FAQ </span>
          </Link>*/}
          <Link
            className={`list-group-item ${lastPath === "terms-and-conditions" ? "active" : ""
              }`}
            to="terms-and-conditions"
          >
            <span className="crancy-psidebar__icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.7176 10.1744C17.7176 12.1079 17.7189 14.0414 17.7169 15.9755C17.7162 17.1906 17.1152 17.7922 15.9092 17.7929C12.1812 17.7929 8.45253 17.7971 4.72457 17.7916C2.4236 17.7881 0.527657 16.2194 0.0858042 13.9719C-0.410933 11.4451 1.3023 8.93781 3.84851 8.49666C4.13058 8.44802 4.17295 8.33339 4.17226 8.09093C4.166 6.00672 4.16808 3.9225 4.16878 1.83829C4.16947 0.600267 4.76348 0.00626599 5.99664 0.00626599C8.48588 0.00626599 10.9751 0.0118239 13.4651 1.33536e-05C13.8062 -0.00137612 14.0528 0.105613 14.2897 0.346687C15.3117 1.3874 16.3434 2.41979 17.3848 3.44105C17.6286 3.68004 17.7259 3.93362 17.7238 4.27057C17.7127 6.23737 17.7176 8.20556 17.7176 10.1744ZM13.1997 1.07616C13.1135 1.06366 13.0691 1.05115 13.0246 1.05115C10.6173 1.04976 8.21007 1.04768 5.8028 1.05115C5.39708 1.05185 5.21575 1.25193 5.21436 1.69587C5.21089 3.84886 5.21505 6.00116 5.2088 8.15415C5.20811 8.36743 5.26994 8.45428 5.49295 8.48832C6.18978 8.59322 6.81573 8.87946 7.40279 9.2692C7.56258 9.3755 7.77863 9.44497 7.96969 9.44636C9.64748 9.45956 11.326 9.454 13.0045 9.454C13.5832 9.454 14.1619 9.44358 14.7406 9.45817C15.1769 9.46929 15.4485 9.90975 15.1957 10.2266C15.0755 10.3773 14.8094 10.4836 14.6079 10.4857C12.7446 10.5051 10.8813 10.4968 9.01805 10.4968C8.89647 10.4968 8.77559 10.4968 8.69083 10.4968C8.94372 11.1964 9.18827 11.8717 9.44463 12.5796C11.1162 12.5796 12.8391 12.5796 14.5628 12.5796C15.0324 12.5796 15.2756 12.7547 15.2804 13.093C15.2853 13.4355 15.04 13.6224 14.578 13.6224C13.1198 13.6231 11.6615 13.6224 10.2033 13.6224C9.92677 13.6224 9.65097 13.6224 9.35848 13.6224C9.19036 14.8646 8.63595 15.8838 7.65081 16.7474C7.85993 16.7474 7.97317 16.7474 8.08711 16.7474C10.6799 16.7474 13.2719 16.7474 15.8647 16.7474C16.5428 16.7474 16.6734 16.6174 16.6734 15.9366C16.6741 12.2677 16.6734 8.59878 16.6734 4.92987C16.6734 4.80551 16.6734 4.68185 16.6734 4.52137C16.5226 4.52137 16.4094 4.52137 16.2968 4.52137C15.5097 4.52137 14.7225 4.52206 13.9354 4.52137C13.356 4.52067 13.2011 4.36505 13.2004 3.77661C13.1983 2.88734 13.1997 1.99669 13.1997 1.07616ZM8.33305 13.091C8.32541 11.0769 6.69207 9.45192 4.67872 9.45609C2.67093 9.46026 1.03899 11.1033 1.04663 13.1132C1.05497 15.1272 2.6883 16.7529 4.70096 16.7488C6.70945 16.7439 8.34069 15.1008 8.33305 13.091ZM15.7605 3.4612C15.2783 2.97141 14.7684 2.45313 14.2647 1.94181C14.2647 2.41978 14.2647 2.93181 14.2647 3.4612C14.799 3.4612 15.3138 3.4612 15.7605 3.4612Z"
                  fill="white"
                />
                <path
                  d="M10.9293 7.37145C9.71423 7.37145 8.49913 7.37214 7.28473 7.37075C6.84913 7.37006 6.60805 7.18387 6.60597 6.85317C6.60389 6.52039 6.84495 6.32865 7.27778 6.32865C9.71908 6.32795 12.1604 6.32795 14.6017 6.32865C15.0373 6.32865 15.2784 6.51553 15.2805 6.84623C15.2826 7.17901 15.0408 7.37075 14.6087 7.37145C13.3824 7.37214 12.1555 7.37145 10.9293 7.37145Z"
                  fill="white"
                />
                <path
                  d="M3.94413 13.8888C4.59441 13.2323 5.18841 12.6327 5.78241 12.0339C5.85536 11.9602 5.92623 11.8831 6.00474 11.8143C6.2472 11.6017 6.55148 11.5948 6.75435 11.7928C6.96346 11.9971 6.9725 12.2986 6.7488 12.5383C6.44937 12.8592 6.13117 13.1635 5.82062 13.4741C5.34681 13.9486 4.87578 14.4266 4.39641 14.8962C4.09976 15.1866 3.82048 15.1831 3.52105 14.892C3.21398 14.594 2.91107 14.2911 2.61372 13.984C2.34833 13.7103 2.32956 13.4108 2.55049 13.1878C2.76725 12.969 3.08405 12.9857 3.34944 13.2462C3.54674 13.4407 3.72668 13.6526 3.94413 13.8888Z"
                  fill="white"
                />
              </svg>
            </span>
            <span className="crancy-psidebar__title">Terminos y condiciones</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
