import React from "react";

const SignInForm = (props) => { 
  const { onRouteChange, onInputFormChange, onSigninSubmit } = props;

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
    <main className="pa4 black-80">
      <form className="measure">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f1 fw6 ph0 mh0">Sign In</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="email" name="email"  id="email-address" autoComplete="off"
              onChange={onInputFormChange}
            />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
              type="password" name="password"  id="password" autoComplete="off"
              onChange={onInputFormChange}
            />
          </div>
        </fieldset>
        <div className="">
          <input 
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
            type="button" 
            value="Sign in" 
            onClick={() => onSigninSubmit()}
          />
        </div>
        <div className="lh-copy mt3">
          <p 
            className="f6 link dim black db pointer"
            onClick={() => onRouteChange("register")}
          >Register</p>
        </div>
      </form>
    </main>
    </article>
  );
}

export default SignInForm;
