/**
 * Footer component displaying company information, navigation links, and social media
 * @returns {JSX.Element} Footer component with company branding, product links, engagement links, and social media icons
 */
function Footer() {
  return (
    <footer>
      <div className="grid grid-cols-4 gap-5 bg-[#F8F8F8] px-30 py-20">
        <div className="flex flex-col gap-5 justify-end">
          <div>
            <img src="/icon/logo-original.svg" alt="" />
          </div>
          <p className="text-[#4F5665]">
            Coffee Shop is a store that sells some good meals, and especially
            coffee. We provide high quality beans
          </p>
          <span className="text-[#AFB5C0] text-sm">©2020CoffeeStore</span>
        </div>
        <div>
          <h1 className="mb-5">Product</h1>
          <ul className="flex flex-col gap-4 text-[#4F5665]">
            <li>Our Product</li>
            <li>Pricing</li>
            <li>Locations</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h1 className="mb-5">Engage</h1>
          <ul className="flex flex-col gap-4 text-[#4F5665]">
            <li>Our Product</li>
            <li>Pricing</li>
            <li>Locations</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h1 className="mb-5">Social Media</h1>
          <ul className="flex items-center justify-start gap-5">
            <li className="bg-[#0B132A] rounded-full">
              <a href="https://www.facebook.com">
                <img src="/icon/icon-facebook.svg" alt="Icon Facebook" />
              </a>
            </li>
            <li className="bg-[#0B132A] rounded-full">
              <a href="https://www.x.com">
                <img src="/icon/icon-twitter.svg" alt="Icon Twitter" />
              </a>
            </li>
            <li className="bg-[#0B132A] rounded-full">
              <a href="https://www.instagram.com">
                <img src="/icon/icon-instagram.svg" alt="Icon Instagram" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
