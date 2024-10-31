import React from "react";
import imgProfile from "../../../assets/img/profile-side.png";
import coverImg from "../../../assets/img/side-cover.png";

function PersonalInfo() {
  return (
    <div className="tab-pane fade show active">
      <form action="#">
        <div className="row">
          <div className="col-12">
            <div className="crancy-ptabs__separate">
              <div className="crancy-ptabs__form-main">
                <div className="crancy__item-group">
                  <h4 className="crancy__item-group__title">
                    Update Parsonal Info
                  </h4>
                  <div className="crancy__item-form--group">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">
                            Frist Name{" "}
                          </label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            placeholder="Demo Name"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">
                            Last Name{" "}
                          </label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            placeholder="Demo Name"
                            required="required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="crancy__item-form--group mg-top-form-20">
                    <label className="crancy__item-label">Email Address</label>
                    <input
                      className="crancy__item-input"
                      type="email"
                      placeholder="demo3243@gmail.com"
                      required="required"
                    />
                  </div>

                  <div className="crancy__item-form--group">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">Mobile</label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            placeholder="+98 000 000 0000"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="crancy__item-form--group mg-top-form-20">
                          <label className="crancy__item-label">Fax</label>
                          <input
                            className="crancy__item-input"
                            type="text"
                            placeholder="+25 000 000"
                            required="required"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="crancy__item-form--group  mg-top-form-20">
                    <label className="crancy__item-label">Select Gender</label>
                    <select
                      className="form-select crancy__item-input"
                      aria-label="Default select example"
                      defaultValue={0}
                    >
                      <option value="0">Select Gender</option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                      <option value="3">Other</option>
                    </select>
                  </div>
                  <div className="crancy__item-form--group  mg-top-form-20">
                    <label className="crancy__item-label">Location</label>
                    <select
                      className="form-select crancy__item-input"
                      aria-label="Default select example"
                      defaultValue={0}
                    >
                      <option value="0">Select location here</option>
                      <option value="1">Bangladesh</option>
                      <option value="2">United States</option>
                      <option value="3">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="crancy-ptabs__form-update">
                <div className="crancy-ptabs__sidebar">
                  <div className="crancy-ptabs__ssingle crancy-ptabs__srofile">
                    <div className="crancy-ptabs__sheading">
                      <h4 className="crancy-ptabs__stitle">Update Profile </h4>
                      <p className="crancy-ptabs__stext">
                        Profile of at least Size
                        <b>300x300.</b> <br />
                        Gifs work too. <b>Max 5mb.</b>
                      </p>
                    </div>
                    <div className="crancy-ptabs__sauthor">
                      <div className="crancy-ptabs__sauthor-img crancy-ptabs__pthumb">
                        <img src={imgProfile} alt="#" />
                        <label
                          className="crancy-ptabs__sedit"
                          htmlFor="file-input"
                        >
                          <span>
                            <svg
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                                fill="white"
                              ></path>
                              <path
                                d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                                fill="white"
                              ></path>
                            </svg>
                          </span>
                        </label>
                        <input id="file-input" type="file" />
                      </div>
                    </div>
                  </div>
                  <div className="crancy-ptabs__ssingle crancy-ptabs__scover">
                    <div className="crancy-ptabs__sheading">
                      <h4 className="crancy-ptabs__stitle crancy-ptabs__stitle--update">
                        Update Cover{" "}
                      </h4>
                      <p className="crancy-ptabs__stext">
                        Cover of at least Size
                        <b>1170x920</b>
                      </p>
                    </div>
                    <div className="crancy-ptabs__sauthor-img crancy-ptabs__pthumb">
                      <img src={coverImg} alt="#" />
                      <label
                        className="crancy-ptabs__sedit"
                        htmlFor="file-input"
                      >
                        <span>
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                              fill="white"
                            ></path>
                            <path
                              d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                              fill="white"
                            ></path>
                          </svg>
                        </span>
                      </label>
                      <input id="file-input" type="file" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="crancy__item-group mg-top-30">
              <h4 className="crancy__item-group__title">Social Information</h4>
              <div className="crancy__item-form--group">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group mg-top-form-20">
                      <label className="crancy__item-label">Facebook</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group mg-top-form-20">
                      <label className="crancy__item-label">Youtube</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group mg-top-form-20">
                      <label className="crancy__item-label">Twitter</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group  mg-top-form-20">
                      <label className="crancy__item-label">Pinterest</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group  mg-top-form-20">
                      <label className="crancy__item-label">Linkedin</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="crancy__item-form--group  mg-top-form-20">
                      <label className="crancy__item-label">Instagram</label>
                      <input
                        className="crancy__item-input"
                        type="url"
                        placeholder="https://example.com/demo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="crancy__item-button--group crancy__item-button--group--fix crancy__ptabs-bottom">
          <button className="crancy-btn crancy-btn__nostyle crancy-color4 p-0">
            Cancel
          </button>
          <button className="crancy-btn crancy-color8__bg" type="submit">
            <svg
              width="26"
              height="30"
              viewBox="0 0 26 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.2484 25.8438C18.5393 25.8472 23.4162 21.5133 24.045 16.2064C24.559 11.8667 23.0512 8.36438 19.6548 5.6833C19.0487 5.20482 18.9054 4.70219 19.2659 4.22716C19.6172 3.76249 20.1767 3.73373 20.7634 4.20071C25.0411 7.61331 26.7672 12.0576 25.6858 17.452C24.6613 22.5657 20.4371 26.5753 15.443 27.4793C14.7153 27.6116 13.9841 27.699 13.2439 27.7197C13.2462 27.094 13.2473 26.4683 13.2484 25.8438Z"
                fill="white"
              />
              <path
                d="M12.7651 3.59243C7.91199 3.64879 3.17832 7.14075 2.11629 12.3707C1.17592 17.0048 2.66891 20.8142 6.34623 23.7379C6.69304 24.014 6.97618 24.2935 6.90454 24.7812C6.79652 25.5127 6.02671 25.7956 5.37289 25.3252C3.90151 24.2682 2.70757 22.9455 1.78767 21.3755C-2.76862 13.6025 1.81951 3.52227 10.6285 1.93961C11.3392 1.81194 12.0521 1.74063 12.7707 1.69922C12.7685 2.33067 12.7662 2.96212 12.7651 3.59243Z"
                fill="white"
              />
              <path
                d="M19.2544 11.9937C19.2647 12.5941 19.0702 12.976 18.7177 13.2716C16.4049 15.2166 14.0989 17.1696 11.7679 19.0927C10.9435 19.7725 9.85758 19.6183 9.19921 18.7695C8.46352 17.8217 7.75171 16.8544 7.05354 15.8768C6.54526 15.1648 6.68058 14.2757 7.33213 13.7857C7.99732 13.2854 8.8308 13.4039 9.39252 14.1078C9.79618 14.6139 10.1885 15.1314 10.5489 15.6686C10.7661 15.9941 10.9139 15.978 11.1982 15.7364C12.9345 14.2573 14.6868 12.7977 16.4356 11.3335C16.6824 11.1265 16.9143 10.8976 17.2156 10.7665C18.1776 10.3455 19.251 11.0575 19.2544 11.9937Z"
                fill="white"
              />
              <path
                d="M13.2483 25.8439C13.2472 26.4696 13.2449 27.0953 13.2437 27.7199C13.2415 28.1408 13.2517 28.5629 13.2335 28.9839C13.2142 29.4198 13.005 29.5429 12.6525 29.3037C11.5836 28.5802 10.525 27.8395 9.46523 27.0999C9.173 26.8963 9.17186 26.6663 9.46409 26.4616C10.5238 25.7231 11.5813 24.9813 12.6513 24.259C13.0061 24.0197 13.213 24.1428 13.2335 24.5799C13.2528 25.0008 13.2449 25.4218 13.2483 25.8439Z"
                fill="white"
              />
              <path
                d="M12.7651 3.59318C12.7663 2.96288 12.7685 2.33143 12.7697 1.70113C12.7708 1.26176 12.7572 0.821235 12.7765 0.381863C12.7924 0.0115033 12.9982 -0.105816 13.3064 0.102368C14.3889 0.836187 15.4646 1.58266 16.5391 2.32913C16.8325 2.53271 16.8313 2.7639 16.5402 2.96633C15.4657 3.71395 14.3923 4.46158 13.3075 5.19424C13.005 5.39783 12.7924 5.28511 12.7765 4.91245C12.7572 4.47423 12.7674 4.03371 12.7651 3.59318Z"
                fill="white"
              />
            </svg>
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfo;
