import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import chai from "chai";

const { expect } = chai;

describe("Cert", function () {
  async function deployCertFixture() {
    const [admin, other] = await ethers.getSigners();

    const Cert = await ethers.getContractFactory("Cert");
    const cert = await Cert.deploy();

    return { cert, admin, other };
  }

  it("Should set the right admin", async function () {
    const { cert, admin } = await loadFixture(deployCertFixture);

    expect(cert.deploymentTransaction().from).to.equal(admin.address);
  });

  it("Should issue the certificate", async function () {
    const { cert } = await loadFixture(deployCertFixture);

    await expect(cert.issue(1024, "Sumi", "CED", "A", "26-02-2024"))
      .to.emit(cert, "Issued")
      .withArgs("CED", 1024, "A");
  });

  it("Should read the certificate", async function () {
    const { cert } = await loadFixture(deployCertFixture);

    await cert.issue(1024, "Sumi", "CED", "A", "26-02-2024");

    const certificate = await cert.Certificates(1024);

    expect(certificate[0]).to.equal("Sumi");
    expect(certificate[1]).to.equal("CED");
    expect(certificate[2]).to.equal("A");
    expect(certificate[3]).to.equal("26-02-2024");
  });

  it("Should revert the issuing", async function () {
    const { cert, other } = await loadFixture(deployCertFixture);

    await expect(
      cert.connect(other).issue(1024, "Lekshmi", "CBR", "B", "25-01-2024"),
    ).to.be.revertedWith("Access Denied");
  });
});
