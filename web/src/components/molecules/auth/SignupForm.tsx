function SignupForm() {
  return (
    <div className="flex flex-col gap-4 p-2 max-w-92 w-full bg-primary rounded-md shadow-md">
      <label className="flex flex-col gap-2">
        Username:
        <input type="text" placeholder="Username" />
      </label>
      <label className="flex flex-col gap-2">
        Password:
        <input type="password" placeholder="Password" />
      </label>
      <label className="flex flex-col gap-2">
        Repeat Password:
        <input type="password" placeholder="Password" />
      </label>
      <button type="submit" className="bg-red-500 rounded-md">Signup</button>
    </div>
  )
}

export default SignupForm
