import Button from "../components/Button";
import Input from "../components/Input";

function ProfilePage() {
  return (
    <div className="px-20 py-10 mt-20">
      <h1 className="font-medium text-5xl">Profile</h1>
      <div className="grid grid-cols-[1fr_2fr] mt-10 gap-5">
        <div className="p-7 flex flex-col gap-5 border border-[#E8E8E8] items-center h-max">
          <div>
            <h2 className="font-medium text-xl text-[#0B132A]">
              Ghaluh Wizard
            </h2>
            <p className="text-[#4F5665]">Email@gamil.com</p>
          </div>
          <img src="/public/img-menus/image1.png" alt="" />
          <Button className="bg-[#FF8906]">Upload New Photo</Button>
        </div>
        <div className="border border-[#E8E8E8] py-5 px-10 flex flex-col gap-7">
          <Input
            id="fullName"
            type="text"
            label="Full Name"
            placeholder="Itsna Maulanana"
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="hasanmaulana453@gmail.com"
          />
          <Input id="phone" type="number" label="Phone" placeholder="0987654" />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="*******"
            passwordInProfile={true}
          />
          <Input
            id="address"
            type="text"
            label="Address"
            placeholder="Pati semarang"
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
