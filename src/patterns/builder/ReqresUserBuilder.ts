/**
 * Builder Pattern Implementation - Reqres User Data
 *
 * Purpose: Constructs user data specifically for reqres.in API requests.
 */

export interface ReqresUser {
  name: string;
  job: string;
}

export class ReqresUserBuilder {
  private user: Partial<ReqresUser> = {};

  public withName(name: string): ReqresUserBuilder {
    this.user.name = name;
    return this;
  }

  public withJob(job: string): ReqresUserBuilder {
    this.user.job = job;
    return this;
  }

  public build(): ReqresUser {
    if (!this.user.name) {
      this.user.name = "John Doe";
    }
    if (!this.user.job) {
      this.user.job = "Software Engineer";
    }
    return this.user as ReqresUser;
  }

  public static default(): ReqresUserBuilder {
    return new ReqresUserBuilder().withName("Morpheus").withJob("Leader");
  }
}
