import React, { useState } from "react";

function SettingsFaq() {
  const [active, setActive] = useState(1);

  return (
    <div className="tab-pane fade show active">
      <div
        className="crancy-accordion accordion accordion-flush crancy__item-group"
        id="crancy-accordion"
      >
        <h4 className="crancy__item-group__title">
          Frequently Asked Questions
        </h4>
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-1"
            onClick={() => setActive(active === 1 ? false : 1)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 1 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseOne"
              aria-expanded="false"
              aria-controls="ac-collapseOne"
            >
              Can I resell an NFT?
            </button>
          </h2>
          <div
            id="ac-collapseOne"
            className={`accordion-collapse collapse${
              active === 1 ? "show" : ""
            }`}
            aria-labelledby="nftac-1"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-2"
            onClick={() => setActive(active === 2 ? false : 2)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 2 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseTwo"
            >
              What can you do with an NFT after buying it?
            </button>
          </h2>
          <div
            id="ac-collapseTwo"
            className={`accordion-collapse collapse${
              active === 2 ? "show" : ""
            }`}
            aria-labelledby="nftac-2"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-3"
            onClick={() => setActive(active === 3 ? false : 3)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 3 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseThree"
              aria-expanded="false"
              aria-controls="ac-collapseThree"
            >
              Can you lose money on NFT?
            </button>
          </h2>
          <div
            id="ac-collapseThree"
            className={`accordion-collapse collapse${
              active === 3 ? "show" : ""
            }`}
            aria-labelledby="nftac-3"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-4"
            onClick={() => setActive(active === 4 ? false : 4)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 4 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseFour"
              aria-expanded="false"
              aria-controls="ac-collapseFour"
            >
              How does NFT prove ownership?
            </button>
          </h2>
          <div
            id="ac-collapseFour"
            className={`accordion-collapse collapse${
              active === 4 ? "show" : ""
            }`}
            aria-labelledby="nftac-4"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-5"
            onClick={() => setActive(active === 5 ? false : 5)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 5 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseFive"
              aria-expanded="false"
              aria-controls="ac-collapseFive"
            >
              How can you tell if someone owns an NFT?
            </button>
          </h2>
          <div
            id="ac-collapseFive"
            className={`accordion-collapse collapse${
              active === 5 ? "show" : ""
            }`}
            aria-labelledby="nftac-5"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-6"
            onClick={() => setActive(active === 6 ? false : 6)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 6 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseSix"
              aria-expanded="false"
              aria-controls="ac-collapseSix"
            >
              Can you lose more than you invest in NFTs?
            </button>
          </h2>
          <div
            id="ac-collapseSix"
            className={`accordion-collapse collapse${
              active === 6 ? "show" : ""
            }`}
            aria-labelledby="nftac-6"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
        {/* <!-- Single Accordion --> */}
        <div className="accordion-item crancy-accordion__single">
          <h2
            className="accordion-header"
            id="nftac-7"
            onClick={() => setActive(active === 7 ? false : 7)}
          >
            <button
              className={`accordion-button  crancy-accordion__heading ${
                active === 7 ? "" : "collapsed"
              }`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#ac-collapseSeven"
              aria-expanded="false"
              aria-controls="ac-collapseSeven"
            >
              What can you do with an NFT after buying it?
            </button>
          </h2>
          <div
            id="ac-collapseSeven"
            className={`accordion-collapse collapse${
              active === 7 ? "show" : ""
            }`}
            aria-labelledby="nftac-7"
            data-bs-parent="#crancy-accordion"
          >
            <div className="accordion-body crancy-accordion__body">
              What you do own when you buy an NFT are the keys to a non-fungible
              – perhaps unique – token. That token is yours to trade or hold or
              display in Decentraland. But the digital file associated with an
              NFT is just as easy to copy and paste and download as any other –
              the Finally, players lose their NFTs sometimes according to the
              rules and regulations of the NFT game.
            </div>
          </div>
        </div>
        {/* <!-- End Single Accordion --> */}
      </div>
    </div>
  );
}

export default SettingsFaq;
