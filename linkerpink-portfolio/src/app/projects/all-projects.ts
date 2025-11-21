function formatDisplayDate(date: string): string {
  if (date.toLowerCase() === "not released") return "Not Released";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// All projects
export const allProjects = [
    
    
  // Robo Rebellion: Dawn of the Machine //
  {
    title: "Robo Rebellion: Dawn of the Machine",
    slug: "robo-rebellion-dawn-of-the-machine",
    banner: "/images/robo rebellion.png",
    icon: "/images/robo rebellion icon.webp",
    date: "2024-07-10",
    displayDate: formatDisplayDate("2024-07-10"),
    platform: "Itch.io",
        description:
            "Robo Rebellion Dawn of the Machine, is a top down TwinStick game made by a team of 6 people. 3 Artists and 3 Developers, the game was made as a school project within a short timespan of 4 weeks with it's end goal being a sci-fi based top down shooter.\n\nFEATURES\n\nThe game build supports both QWERTY keyboards and controller. Realistic gun bass! Trigger warning. (Headphone users be warned.) \n\nthe player was made with multiple people, so I will only be showing the parts I made, and are also interesting. \n\nDevelopers: \n[Noah van Uunen](https://linkerpink.vercel.app/) \n[Kaisor lue](https://lulaobobao.itch.io/) \nRobin Hain \n\nArtists: \n[Noah Moes](https://dark-knight8092.itch.io/) \nMandy Blansjaar \nLieke van der Vring \n\nWhat I made: \n- Player Movement, dashing and rotation \n- Player Interaction \n- Pickups \n- Keycards & inventory \n- Keycard stacking UI \n- Weapon switching \n- Player Camera, camera switching and screenshake \n- GameManager, rumble and game state management \n- Tutorial popups \n- Main Menu camera switching \n- Weapon, Ammo & Health UI",

    href: "https://lulaobobao.itch.io/robo-rebellion-dawn-of-the-machine",
    github: "https://github.com/GLU-Gaming/twinstick-2024-arcane-interactive",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/robo rebellion.png" },
      { type: "image", src: "/images/robo rebellion 2.png" },
      { type: "image", src: "/images/robo rebellion 1.webp" },
      { type: "image", src: "/images/robo rebellion 6.jpeg" },
      { type: "image", src: "/images/robo rebellion 4.jpeg" },
      { type: "image", src: "/images/robo rebellion 3.jpeg" },
      { type: "youtubeId", src: "iHwMC_45iww", title: "Launch Trailer" },
      { type: "youtubeId", src: "pjqwkHgBgVQ", title: "Launch Trailer" },
    ],

    featured: true,

    codeSnippets: [
      {
        name: "Player.cs",
        language: "C#",
        description:
          "Here are some functions I made for the player. I was in control of the player movement, controller support, animation switching, state switching, player rotation / look at and dashing",
        code: `
public enum PlayerState
{
    Idle,
    Move,
    Dash,
    Dead
}

public PlayerState state;

private void Awake()
{
    //Input
    controls = new Controls();

    controls.Player.Movement.performed += context => MoveInput(context.ReadValue<Vector2>());
    controls.Player.Movement.canceled += context => state = PlayerState.Idle;
    
    controls.Player.Dash.performed += context => DashInput();

    input = GetComponent<PlayerInput>();

    //Animations / model swaps
    robotSwordSlash = GameObject.Find("P_RobotSwordSlash");
    robotRifleRun = GameObject.Find("P_RobotRifleRun");
    robotRifleIdle = GameObject.Find("P_RobotRifleIdle");
    }
    
private void MoveInput(Vector2 direction)
{
    if (state != PlayerState.Dash)
    {
    state = PlayerState.Move;
        moveDirection = new Vector3(direction.x, 0f, direction.y);
    }     
    }

    private void DashInput()
    {
    
    if (canDash && state != PlayerState.Dash)
    {
    state = PlayerState.Dash;
        audioSource.PlayOneShot(dashClip, 1);
        dashTimer = 0f;
        dashDirection = lastMoveDirection;
        dashCoolDown = initialDashCoolDown;
    }
    
}

private void Start()
{
    //States
    state = PlayerState.Idle;
    
    //Dash
    initialDashStrength = dashStrength;
    initialDashCoolDown = dashCoolDown;
    dashTrail.SetActive(false);
    
    //Camera
    cameraManager = FindObjectOfType<CameraManager>();
    
    //Animations / model swaps
    robotSwordSlash.SetActive(false);
    robotRifleRun.SetActive(false);
    robotRifleIdle.SetActive(false);
}

private void Update()
{
    if (!gameManager.gamePaused)
    {
    switch (state)
        {
            case PlayerState.Idle:
                IdleState();
                break;
            case PlayerState.Move:
                MoveState();
                break;
            case PlayerState.Dash:
                DashState();
                break;
            case PlayerState.Dead:
                DeadState();
                break;
        }
        
        if (state != PlayerState.Dead)
        {
        if (moveDirection != Vector3.zero)
            {
                lastMoveDirection = moveDirection;
                dashDirection = lastMoveDirection;
            }
            
            //Input
            aim = controls.Player.Aim.ReadValue<Vector2>();

            RotatePlayer();
            
            if (Input.GetKeyDown(KeyCode.Space))
            {
                //cameraManager.ScreenShake(10f, 2f, 0.2f);
                }

            if (dashCoolDown > 0f)
            {
            dashCoolDown -= Time.deltaTime;
                canDash = false;
            }
            else
            {
            canDash = true;
            }
            }
            
            //Debug
            //if (Input.GetKeyDown(KeyCode.B)) enableDebugText = !enableDebugText;
    }        
    }

private void FixedUpdate()
{
    if (state != PlayerState.Dash)
    {
    rb.velocity = moveDirection * moveSpeed;
    }
    }
    
private void IdleState()
{
    moveDirection = Vector3.zero;

    if (!melee.isPerformingMelee)
    {
    //Animations / model swaps
    robotSwordSlash.SetActive(false);
        robotRifleRun.SetActive(false);
        robotRifleIdle.SetActive(true);
    }
    
    }

    private void MoveState()
    {
        if (moveDirection == Vector3.zero) 
        {
        state = PlayerState.Idle;
    }
    
    if (!melee.isPerformingMelee)
    {
    //Animations / model swaps
    robotSwordSlash.SetActive(false);
    robotRifleRun.SetActive(true);
    robotRifleIdle.SetActive(false);
    }
    }
    
    private void DashState()
{
    dashTrail.SetActive(true);
    dashStrength = initialDashStrength;
    
    float dashDistance = dashStrength * dashDuration;
    
    LayerMask layerMask = LayerMask.GetMask("environmentLayer");
    
    RaycastHit hit;
    
    if (Physics.Raycast(transform.position, dashDirection, out hit, 2f, layerMask))
    {
    rb.position = hit.point - dashDirection * 0.1f;
        state = PlayerState.Move;
        dashTrail.SetActive(false);
        return;
        }
        
        rb.velocity = dashDirection * dashStrength;
        
        if (dashTimer < dashDuration)
        {
        dashTimer += Time.deltaTime;
        }
        else
            {
        state = PlayerState.Move;
        dashTrail.SetActive(false);
    }
    }

    private void RotatePlayer()
    {
        if (isGamepad)
        {
        //Controller rotation
        if (Mathf.Abs(aim.x) > controllerDeadzone || Mathf.Abs(aim.y) > controllerDeadzone)
        {
        Vector3 playerDirection = Vector3.right * aim.x + Vector3.forward * aim.y;
        
        if (playerDirection.sqrMagnitude > 0.0f)
                {
                    Quaternion newRotation = Quaternion.LookRotation(playerDirection, Vector3.up);
                    transform.rotation = Quaternion.RotateTowards(transform.rotation, newRotation, controllerRotationSmoothing * Time.deltaTime);
                }
                }
        }
        else
        {
        //Mouse rotation
        Ray ray = Camera.main.ScreenPointToRay(aim);
            Plane groundPlane = new Plane(Vector3.up, Vector3.zero);
            float rayDistance;

            if (groundPlane.Raycast(ray, out rayDistance))
            {
            Vector3 point = ray.GetPoint(rayDistance);
            LookAt(point);
            }
            }   
            }
            
            private void LookAt(Vector3 _point)
            {
                Vector3 heightCorrectedPoint = new Vector3(_point.x, transform.position.y, _point.z);
                transform.LookAt(heightCorrectedPoint);
                }
                
                //Input
                public void OnDeviceChange(PlayerInput _input)
                {
    isGamepad = _input.currentControlScheme.Equals("Gamepad") ? true : false;
    }
    
    private void OnTriggerEnter(Collider other)
{
    if (other.gameObject.CompareTag("Shotgun Pickup"))
    {
    cameraManager.ChangeCamera(cameraManager.currentCam, cameraManager.playerCamZoomedSmall);
    }
    }
    
        `,
    },

      {
        name: "PlayerInteraction.cs",
        language: "C#",
        description:
          "I was also in charge of the player interaction, pickups, keycards and inventory. the code blocks below are conntected with this one",
        code: `
private void OnTriggerStay(Collider other)
{
    if (controls.Player.Interact.IsPressed())
    {
        if (other.gameObject.tag == "Interactable")
        {
            Debug.Log("Interacted with: " + other);

            InteractionIcon interactionIcon = other.GetComponentInChildren<InteractionIcon>();

            KeyCard keyCard = other.GetComponent<KeyCard>();
            if (keyCard != null && interactionIcon != null)
            {
            inventory.AddKeyCard(keyCard.GetKeyCardType());
                playerAudioSource.PlayOneShot(keycardPickUpClip, 1);
                Destroy(interactionIcon.gameObject);
                Destroy(keyCard.gameObject);
            }

            Door door = other.GetComponent<Door>();
            if (door == null)
            {
            return;
            }
            
            else if (inventory.ContainsKeyCard(door.GetKeyCardType()))
            {
            inventory.RemoveKeyCard(door.GetKeyCardType());
                door.OpenAllDoors(door.GetKeyCardType());
                playerAudioSource.PlayOneShot(doorOpenClip, 1);
            }
            
            if (!inventory.ContainsKeyCard(door.GetKeyCardType()))
            {
            door.PlayLockedAnimation(door);
            }
        }
        
        if (other.gameObject.tag == "Shotgun Pickup")
        {
        playerAudioSource.PlayOneShot(shotgunPickUpClip, 1);
            inventory.AddWeapon(Weapons.Shotgun);
            Destroy(other.gameObject);
            cameraManager.ChangeCamera(cameraManager.currentCam, cameraManager.playerCam);
        }
        }
}
`,
      },

      {
        name: "PlayerInventory.cs",
        language: "C#",
        description:
          "This script shows the player inventory / weapon switching",
        code: `
        public enum Weapons
        {
    Rifle,
    Shotgun,
}

public Weapons selectedWeapon;

private void Start()
{
    AddWeapon(Weapons.Rifle);
    selectedWeapon = Weapons.Rifle;
}

public List<KeyCard.KeyCardType> GetKeyCardList()
{
    return keyCardList;
}

public void AddKeyCard(KeyCard.KeyCardType keyCardType)
{
    if (!keyCardList.Contains(keyCardType))
    {
    Debug.Log("Added KeyCard: " + keyCardType);
    keyCardList.Add(keyCardType);
    OnKeysChanged?.Invoke(this, EventArgs.Empty);
    }
    else
        {
        Debug.Log("KeyCard already in inventory: " + keyCardType);
    }
}


public void RemoveKeyCard(KeyCard.KeyCardType keyCardType)
{
    Debug.Log("Removed KeyCard: " + keyCardType);
    keyCardList.Remove(keyCardType);
    OnKeysChanged?.Invoke(this, EventArgs.Empty);
    }

    public bool ContainsKeyCard(KeyCard.KeyCardType keyCardType)
{
    return keyCardList.Contains(keyCardType);
    }
    
    public void AddWeapon(Weapons weapon)
    {
        if (!weaponsList.Contains(weapon))
        {
        Debug.Log("Added Weapon: " + weapon);
        weaponsList.Add(weapon);
        }
        else
    {
        Debug.Log("KeyCard already in inventory: " + weapon);
    }
    }
    
    public Weapons GetSelectedWeapon()
    {
        return selectedWeapon;
}

private void SwitchWeapon()
{
    if (weaponsList.Count > 1)
    {
        switch (selectedWeapon)
        {
            case Weapons.Rifle:
                audioSource.PlayOneShot(rifleSwitch, 1);
                selectedWeapon = Weapons.Shotgun;
                playerShootingRaycast = GetComponent<PlayerShootingRaycast>();
                playerShootingRaycast.shootingEffect = shotgunMuzzleFlash;
                break;
                
                case Weapons.Shotgun:
                    audioSource.PlayOneShot(shotgunSwitch, 1);
                    selectedWeapon = Weapons.Rifle;
                    playerShootingRaycast = GetComponent<PlayerShootingRaycast>();
                playerShootingRaycast.shootingEffect = rifleMuzzleFlash;

                break;
                }
                }
}
`,
      },
      
      {
        name: "KeyUI.cs",
        language: "C#",
        description: "This script shows the keycard stacking ui.",
        code: `
private void Awake()
{
    playerInventory = GameObject.Find("Player").GetComponent<PlayerInventory>();
    
    container = transform.Find("Container");
    keyCardTemplate = container.Find("Key Card Template");
    keyCardTemplate.gameObject.SetActive(false);
    }
    
private void Start()
{
    playerInventory.OnKeysChanged += PlayerInventory_OnKeysChanged;
    UpdateVisual(); // Initial update
    }

private void PlayerInventory_OnKeysChanged(object sender, System.EventArgs e)
{
    UpdateVisual();
    }
    
    private void UpdateVisual()
    {
        // Clean up old keys
        foreach (Transform child in container)
        {
            if (child == keyCardTemplate) continue;
        Destroy(child.gameObject);
        }

    // Instantiate current key list
    List<KeyCard.KeyCardType> keyCardList = playerInventory.GetKeyCardList();
    for (int i = 0; i < keyCardList.Count; i++)
    {
    KeyCard.KeyCardType keyCardType = keyCardList[i];
    Transform keyCardTransform = Instantiate(keyCardTemplate, container);
    keyCardTransform.gameObject.SetActive(true);
    keyCardTransform.GetComponent<RectTransform>().anchoredPosition = new Vector2(distanceX * i, 0);
    Image keyCardImage = keyCardTransform.Find("Key Card Background").GetComponent<Image>();
    
        switch (keyCardType)
        {
            default:
                case KeyCard.KeyCardType.red: keyCardImage.color = Color.red; break;
            case KeyCard.KeyCardType.green: keyCardImage.color = Color.green; break;
            case KeyCard.KeyCardType.blue: keyCardImage.color = Color.blue; break;
            case KeyCard.KeyCardType.yellow: keyCardImage.color = Color.yellow; break;
            case KeyCard.KeyCardType.purple: keyCardImage.color = new Color(0.5f, 0.0f, 0.5f); break;
            }
            }
            }
            `,
        },
        
        {
        name: "CameraManager.cs",
        language: "C#",
        description:
          "This is the camera manager I made for the game. This manager is able to switch cameras in a smooth way using CineMachine, and give screenshake when needed.",
        code: `
private void Start()
{
    //Set the current cam
    currentCam = playerCam;
    currentCam.Priority = 100;
}

public void ScreenShake(float amplitude, float frequency, float length)
{
    perlin = currentCam.GetCinemachineComponent<CinemachineBasicMultiChannelPerlin>();
    
    perlin.m_AmplitudeGain = amplitude;
    perlin.m_FrequencyGain = frequency;
    StartCoroutine(ShakeTimer(length));
}

public void ChangeCamera(CinemachineVirtualCamera oldCam, CinemachineVirtualCamera cam)
{
    oldCam.Priority = 0;
    cam.Priority = 100;
    
    currentCam = cam;
    }

    private IEnumerator ShakeTimer(float length)
    {
    yield return new WaitForSeconds(length);
    
    //Reset noise
    perlin.m_AmplitudeGain = 0;
    perlin.m_FrequencyGain = 0;
    }
    `,
},

{
        name: "GameManager.cs",
        language: "C#",
        description:
        "Here are some functions I made in the GameManager that improve the gameplay experience. The rumble was made with enabling the motors of the controller if the player is playing with a controller, and stopping it in a certain amount of time.",
        code: `
        public void ControllerRumble(float leftMotorIntensity, float rightMotorIntensity, float time)
        {
    if (player != null) 
    {
    if (player.isGamepad)
    {
    Gamepad.current.SetMotorSpeeds(0.50f, 0.50f);
    StartCoroutine(StopControllerRumble(time));
    }
    }
    }
    
    private IEnumerator StopControllerRumble(float time)
    {
        yield return new WaitForSeconds(time);
        InputSystem.ResetHaptics();
}
`,
},
],
},

// Not Suepr Maria 63 //
{
    title: "Not Suepr Maria 63",
    slug: "not-suepr-maria-63",
    banner: "/images/not suepr.webp",
    icon: "/images/not suepr.webp",
    date: "2025-04-17",
    displayDate: formatDisplayDate("2025-04-17"),
    platform: "Itch.io",
    description:
      "This is a remake of Super Mario 64 made in Unity using C#, but made in about 4 weeks of time for a school project. This game was made purely for fun and with love for the original game, I was not trying to make a full and polished remake with intent of having people playing this instead of the original. \n\nI remade the outside of the castle, a bit of the inside of the castle, and bob omb battlefield. Most models were ripped from the original game, but the animations were made by myself, because I could not find the original animations and mixamo animations didn't feel right with capturing the spirit of the original. \n\nWhat I made: \n- Player movement, attacks, animations, interactions etc \n- Scriptable Object based dialogue system that connects a dialogue sequence to the textbox, and spawns them accordingly \n- Scriptable Object based star system \n- GameManager script that handles the state of the game, star selection and loading the level accordingly based on the star that is selected. \n- Base enemy script that enemies could be built off of \n- Boss fight with King Bob Omb \n- Race with Koopa The Quick \n- Scene transitions \n- Cutscene system \n- Billboarded sprites",
    href: "https://linkerpink.itch.io/not-suepr-maria-63",
    github: "https://github.com/Linkerpink/NOT-Suepr-Maria-63",
    
    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/not suepr.webp" },
      { type: "image", src: "/images/not suepr 1.png" },
      { type: "image", src: "/images/not suepr 2.png" },
      { type: "image", src: "/images/not suepr 3.png" },
      { type: "image", src: "/images/not suepr 4.png" },
      { type: "youtubeId", src: "9c8ntgfiQsk", title: "Gameplay Video" },
    ],
    
    featured: true,
    
    codeSnippets: [
      {
        name: "Mario.cs",
        language: "C#",
        description:
        "This is the script that has taken the longest to make by far. This is the script for handling the player's movement, animations, attacks and interactions. It is a very long script so I will not show the variable declarations, because that in it self is already 100 lines. The player works with a state machine which decides what the player character should be doing. It has a few health functions that make sure you can take damage, die and give damage to the enemies. The player has 3 damage hitboxes, one for the cick and one for the punch. those are handled through the animations itself, the other one is more interesting, because that one checks if something is under the player, so if the player jumps on top of an enemy, the enemy will take damage. The player also has a few functions that make sure the player can interact with the environment, like interacting with dialogue triggers, picking up items and collecting coins.",
        code: `
        private void Update()
        {
            isGrounded = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, groundLayer);
    isOnEnemy = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, enemyLayer);
    isCollidingWithPole = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, poleLayer);
    
    if (inputDirection.sqrMagnitude > 0.01f && state != States.DiveSlide && canMove) 
    {
    moveDirection = new Vector3(inputDirection.x, 0, inputDirection.y);
    targetAngle = Mathf.Atan2(moveDirection.x, moveDirection.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
    angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, turnSmoothTime);
    lastAngle = angle;
    }
    else
        {
        moveDirection = Vector3.zero;
        angle = lastAngle;
    }
    
    // Set values for the Animator
    m_animator.SetFloat("stickMovement", moveDirection.sqrMagnitude);
    m_animator.SetBool("isGrounded", isGrounded);
    
    // Decide what state to switch to
    if (canMove && state != States.Jump && state != States.GroundPound && state != States.LongJump && isGrounded && state != States.GroundPound && state != States.Dive && state != States.Punch && state != States.Kick && state != States.DiveSlide && state != States.InsideCannon)
    {
        if (!isCrouching)
        {
        // If not crouching
            
            if (inputDirection.sqrMagnitude >= 0.25f)
            {
            state = States.Run;
                m_animator.Play("Run");
            }
            else if (inputDirection.sqrMagnitude >= 0.01f)
            {
                state = States.Walk;
            }
            else if (state != States.Kick && state != States.Punch)
            {
            state = States.Idle;
            //m_animator.SetTrigger("land");
            }
            
            m_animator.SetBool("crouch", false);
            }
            else
        {
            // If crouching
            
            if (inputDirection.sqrMagnitude >= stickDeadZone)
            {
                state = States.CrouchWalk;
                
            }
            else if (state != States.Kick && state != States.Punch)
            {
            state = States.Crouch;
                m_animator.SetBool("crouch", true);
            }
        }
    }

    if (!isGrounded && state != States.GroundPound && state != States.LongJump && state != States.Dive && state != States.Punch && state != States.Kick)
    {
    state = States.Jump;

    switch (jumpCount)
    {
            case 1:
                m_animator.Play("Jump");
                break;
            
                case 2:
                    m_animator.Play("Double Jump");
                break;
                
            case 3:
                m_animator.Play("Triple jump");
                break;
        }
        }
        
        // State switching
    switch (state)
    {
        //////////Movement//////////////
        
        // Idle
        case States.Idle:
            moveSpeed = Mathf.Max(moveSpeed - deceleration * Time.deltaTime, 0);
            jumpCount = 0;
            isCrouching = false;
            break;
            
            // Walk
            case States.Walk:
                moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxWalkMoveSpeed);
                isCrouching = false;
            break;
            
            // Run
            case States.Run:
                moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxMoveSpeed);
            isCrouching = false;
            break;
            
            // Jump
            case States.Jump:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxMoveSpeed);
            jumpTimer = jumpTimerDuration;
            
            if (isGrounded && canMove || isCollidingWithPole && canMove)
            {
            m_animator.SetTrigger("land");
            state = States.Idle;
            }
            
            isCrouching = false;
            break;
        
        // Crouch
        case States.Crouch:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxCrouchMoveSpeed);
            isCrouching = true;
            break;
        
        // CrouchWalk
        case States.CrouchWalk:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxCrouchMoveSpeed);
            isCrouching = true;
            break;
            
            // GroundPound
            case States.GroundPound:
                float _verticalMovement = 0f;
                
                if (groundPoundTimer <= 0)
                {
                _verticalMovement = groundPoundMoveSpeed;
                }
                
            m_rigidbody.linearVelocity = new Vector3(0, _verticalMovement, 0);

            if (isGrounded && canMove)
            {
                state = States.Idle;
                m_animator.SetTrigger("land");
            }
            
            if (isCollidingWithPole && canMove)
            {
            state = States.Idle;
            m_animator.SetTrigger("land");
            
                ChainChompPole _pole = GameObject.Find("Chain Chomp Area").GetComponentInChildren<ChainChompPole>();
                
                _pole.IncreasePolePosition();
            }
            
            jumpCount = 0;
            isCrouching = false;
            break;
            
        // LongJump
        case States.LongJump:
            isCrouching = false;
            m_animator.SetTrigger("longJump");
            
            if (longJumpTimer < longJumpTimerDuration / 2)
            {
            longJumpTimer += Time.deltaTime;
                
            float _jumpForce = jumpForce / 1.5f;
            float _jumpSpeed = moveSpeed * 6;
            m_rigidbody.linearVelocity = new Vector3(bufferedMoveDirection.x * _jumpSpeed, _jumpForce, bufferedMoveDirection.z * _jumpSpeed);
            }
            else if (longJumpTimer < longJumpTimerDuration)
            {
            longJumpTimer += Time.deltaTime;
            float _jumpForce = 0f;
            float _jumpSpeed = moveSpeed * 6;
            m_rigidbody.linearVelocity = new Vector3(bufferedMoveDirection.x * _jumpSpeed, _jumpForce, bufferedMoveDirection.z * _jumpSpeed);
            }
            else
            {
            if (isGrounded && canMove || isCollidingWithPole && canMove)
                {
            state = States.Idle;
            longJumpTimer = 0;
                    m_animator.SetTrigger("land");
                    }
                    }
            break;
            
            // HighJump
            case States.HighJump:
                if (isGrounded && canMove || isCollidingWithPole && canMove)
            {
                m_animator.SetTrigger("land");
                state = States.Idle;
                }
                
                isCrouching = false;
                break;
                
                // DiveSlide
        case States.DiveSlide:
            moveDirection = new Vector3(bufferedMoveDirection.x, 0, bufferedMoveDirection.z);
            
            if (diveSlideTimer <= 0 && canMove)
            {
                state = States.Idle;
                m_animator.SetTrigger("land");
            }
            isCrouching = false;
            break;
        
        //////////Attacks//////////////
        
        // Punch
        case States.Punch:
            if (attackTimer <= 0)
            {
                state = States.Idle;
            }
            moveDirection = Vector3.zero;
            isCrouching = false;
            break;
        
        // Kick
        case States.Kick:
            if (attackTimer <= 0)
            {
                state = States.Idle;
                }
                moveDirection = Vector3.zero;
                isCrouching = false;
                break;
                
                // Dive
                case States.Dive:
                    if (isGrounded || isCollidingWithPole && canMove)
                    {
                state = States.DiveSlide;
                diveSlideTimer = diveSlideTimerDuration;
                }
                jumpCount = 0;
                isCrouching = false;
                break;
                }
                
                // Set movement and rotations
                if (state != States.GroundPound && state != States.LongJump && state != States.Dive)
    {
                transform.rotation = Quaternion.Euler(0f, angle, 0f);
                }
    
                if (moveDirection != Vector3.zero)
    {
        moveDirection = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
    }
    
    velocity = moveDirection.normalized * moveSpeed;
    if (state != States.GroundPound && state != States.LongJump && state != States.Dive && state != States.DiveSlide)
    {
    m_rigidbody.linearVelocity = new Vector3(velocity.x, m_rigidbody.linearVelocity.y, velocity.z);
    }
    
    // Timers
    if (jumpTimer > 0 && isGrounded)
    {
    jumpTimer -= Time.deltaTime;
    }
    
    if (groundPoundTimer > 0 && state == States.GroundPound)
    {
        groundPoundTimer -= Time.deltaTime;
    }
    
    if (jumpTimer <= 0)
    {
    jumpCount = 0;
    }
    
    if (attackTimer > 0)
    {
    attackTimer -= Time.deltaTime;
    }
    
    if (attackComboTimer > 0)
    {
    attackComboTimer -= Time.deltaTime;
    }
    else
        {
    attackCount = 0;
    }
    
    if (attackCount > 3 && canMove)
    {
    attackCount = 0;
    m_animator.SetTrigger("land");
    }
    
    if (diveSlideTimer > 0)
    {
        diveSlideTimer -= Time.deltaTime;
        }
        
        // Iframes
        if (iFrameTimer > 0)
        {
        iFrameTimer -= Time.deltaTime;
        
        if (blinkTimer <= 0)
        {
        blinkTimer = blinkTimerDuration;
        m_showModel = !m_showModel;
        }
        
        if (blinkTimer > 0)
        {
        blinkTimer -= Time.deltaTime;
        }
        }
        else
            {
        m_showModel = true;
        }

        if (m_showModel)
        {
        m_marioVisual.SetActive(true);
        }
        else
    {
        m_marioVisual.SetActive(false);
    }
    
    if (canMove)
    {
        m_playerInput.actions.FindActionMap("Player").Enable();
        m_playerInput.actions.FindActionMap("UI").Disable();
        }
        else
    {
        m_playerInput.actions.FindActionMap("Player").Enable();
        m_playerInput.actions.FindActionMap("UI").Disable();
    }
    
    // Star stuff
    if (m_pickedUpStar)
    {
    canMove = false;
    
    if (isGrounded && !m_startedVictoryPose)
    {
    m_startedVictoryPose = true;
    m_animator.SetTrigger("victoryPose");
    }
    }
    
    // Holding objects
    if (heldObject != null)
    {
    heldObject.transform.position = new Vector3(transform.position.x, transform.position.y + 2, transform.position.z);
        heldObject.transform.rotation = Quaternion.Euler(0f, angle, 0f);

        if (heldObject.name == "King Bob Omb" && m_kingBobOmb != null)
        {
            m_kingBobOmb.state = KingBobOmb.States.Grabbed;
            }
    }
}

public void OnMove(InputAction.CallbackContext _context)
{
    inputDirection = _context.ReadValue<Vector2>();
    }

    public void OnJump(InputAction.CallbackContext _context)
    {
        if (_context.performed && canMove && state != States.InsideCannon)
        {
        // Long jump
        if (state != States.LongJump && state != States.Dive)
        {
        bufferedMoveDirection = moveDirection;    
        }
        
        if (state == States.CrouchWalk && moveDirection.sqrMagnitude > stickDeadZone)
        {
        jumpCount = 1;
        
        state = States.LongJump;
        }
        
        // Jump
        if (isGrounded && state != States.Jump && state != States.LongJump && state != States.DiveSlide || isCollidingWithPole && state != States.Jump && state != States.LongJump && state != States.DiveSlide)
        {
        if (jumpCount < 3)
        {
        jumpCount++;                
        }
        
        float _jumpForce = jumpForce + jumpCount;
        m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, _jumpForce, m_rigidbody.linearVelocity.z);
        state = States.Jump;
        }
        
        // High jump
        if (state == States.Crouch)
        {
            m_animator.SetBool("crouch", false);
            
            state = States.HighJump;
            
            m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, jumpForce * 2f, m_rigidbody.linearVelocity.z);
            
            m_animator.SetTrigger("highJump");
        }

        if (state == States.DiveSlide && isGrounded && canMove)
        {
            state = States.Idle;
            m_animator.SetTrigger("land");
        }
    }

    if (_context.performed && state == States.InsideCannon)
    {
    float _jumpForce = jumpForce * 10f;
        m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, _jumpForce, m_rigidbody.linearVelocity.z);
        state = States.Jump;
        }
        }
        
        public void OnCrouch(InputAction.CallbackContext _context)
        {
            if (_context.performed && canMove)
            {
            if (isGrounded)
            {
            isGrounded = true;
            isCrouching = true;
            m_animator.SetBool("crouch", true);
            }
            else if (state != States.GroundPound && !isGrounded)
            {
            m_animator.SetTrigger("groundPound");
            state = States.GroundPound;
            groundPoundTimer = groundPoundTimerDuration;
            }
            }
            
            if (_context.canceled && state == States.Crouch || _context.canceled && state == States.CrouchWalk)
    {
        isCrouching = false;
        m_animator.SetBool("crouch", false);
        }
        }
        
        public void OnAttack(InputAction.CallbackContext _context)
        {
            if (_context.performed && canMove)
    {
            // Hold king bob omb
            if (heldObject == null && isCollidingWithKingBobOmb && m_kingBobOmbObject != null)
            {
            heldObject = m_kingBobOmbObject;
            }
            
            // Throw object
            if (heldObject != null)
        {
            print("throw object");
            
            heldObject.transform.position = new Vector3(heldObject.transform.position.x, transform.position.y + 4, heldObject.transform.position.z) + transform.forward * 4f;
            
            if (heldObject.name == "King Bob Omb" && m_kingBobOmb != null && m_kingBobOmb.state == KingBobOmb.States.Grabbed)
            {
            m_kingBobOmb.state = KingBobOmb.States.Thrown;
            heldObject = null;
            }
            }
            
            // Dialogue
            if (m_isCollidingWithDialogueHitbox && m_dialogueHitbox != null)
            {
            DialogueSequence _dialogueSequence = m_dialogueHitbox.GetComponent<DialogueGiver>().dialogueSequence;
            m_textbox.StartDialogueSequence(_dialogueSequence);
            }
            
            // Attacking
            if (attackCount <= 2 && isGrounded && attackTimer <= 0 && moveDirection.sqrMagnitude < stickDeadZone)
            {
            // Punch
            attackCount++;
            state = States.Punch;
            m_animator.Play("Punch");
            attackTimer = attackTimerDuration;
            attackComboTimer = attackComboTimerDuration;
            }
            else if (state != States.Run && attackTimer <= 0 && moveDirection.sqrMagnitude < stickDeadZone)
            {
            // Kick
            attackCount++;
            state = States.Kick;
            m_animator.Play("Kick");
            attackTimer = attackTimerDuration;
            attackComboTimer = attackComboTimerDuration;
        }
        
        if (state != States.Dive && state != States.DiveSlide && moveDirection.sqrMagnitude > stickDeadZone && state != States.LongJump && !isGrounded)
        {
            //Dive
            attackCount++;
            state = States.Dive;
            m_animator.Play("Dive");
            m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x * 1.5f, m_rigidbody.linearVelocity.y, m_rigidbody.linearVelocity.z * 1.5f);
        }
        }
}

public void TakeDamage(int _damageAmount)
{
    if (iFrameTimer <= 0)
    {
        hp -= _damageAmount;
        if (hp <= 0)
        {
            Die();
            }

        iFrameTimer = iFrameDuration;
        
        // Power Meter
        if (!m_powerMeter.showing)
        {
        print("show power meter");
            m_powerMeter.ShowPowerMeter();
        }
        else
        {
        print("skill issueee");
        }
    }
}

public void Heal(int _healAmount)
{
    if (hp < 8)
    {
    hp += _healAmount;    
    }
    
    // Power Meter
    if (m_powerMeter.showing && hp >= 8)
    {
    print("hide power meter");
    m_powerMeter.HidePowerMeter();
    }
    }
    
    public void Die()
    {
        SceneManager.LoadScene("Peach's Castle Inside Main Room");
        }

private void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Jump Hitbox"))
    {
    if (isOnEnemy)
    {
            other.GetComponentInParent<Enemy>().TakeDamage(1);
            m_rigidbody.AddForce(0f,10f,0f,ForceMode.Impulse);
        }
    }
    
    if (other.CompareTag("King Bob Omb"))
    {
    isCollidingWithKingBobOmb = true;
    m_kingBobOmbObject = other.gameObject;
    }
    
    if (other.CompareTag("Dialogue Hitbox"))
    {
    m_isCollidingWithDialogueHitbox = true;
    m_dialogueHitbox = other;
    }
    
    if (other.CompareTag("Star"))
    {
    print("should pick up star");
    GameManager.Instance.GetStar(other.gameObject.GetComponent<StarHolder>().star);
    other.gameObject.SetActive(false);
    m_pickedUpStar = true;
    }
    
    if (other.CompareTag("Top Hitbox"))
    {
    RaceManager _raceManager = FindObjectOfType<RaceManager>();

    if (_raceManager != null)
        {
            _raceManager.EndRace();

            if (_raceManager.raceState == RaceManager.RaceStates.Racing)
            {
            _raceManager.raceState = RaceManager.RaceStates.Won;
            }    
            }
            
            if (GameManager.Instance.currentStar != null && m_kingBobOmb != null)
            {
            if (m_kingBobOmb.stage == 0 && GameManager.Instance.currentStar.name == "Star 1")
            {
            m_textbox.StartDialogueSequence(m_kingBobOmbStartBattleDialogueSequence);    
            }
            }
            
        if (!GameManager.Instance.shownCastleIntroDialogue)
        {
        if (other.CompareTag("Castle Dialogue"))
        {
        GameManager.Instance.shownCastleIntroDialogue = true;
        m_textbox.StartDialogueSequence(GameManager.Instance.castleIntroDialogueSequence);
        
        }
        }
        }
        
        if (other.CompareTag("Enemy"))
    {
        Enemy _enemy = other.GetComponent<Enemy>();
        
        if (!isOnEnemy && state != States.Punch && state != States.Kick && state != States.Dive &&
        state != States.Jump && state != States.GroundPound)
        {
            TakeDamage(_enemy.damageAmount);
        }
        else
        {
        _enemy.TakeDamage(1);
        }
        }
        
        if (other.CompareTag("Death"))
    {
        Die();
        }
}

private void OnTriggerExit(Collider other)
{
    if (other.CompareTag("Dialogue Hitbox"))
    {
    m_isCollidingWithDialogueHitbox = false;
    }
    
    if (other.CompareTag("King Bob Omb"))
    {
    isCollidingWithKingBobOmb = false;
    m_kingBobOmbObject = null;
    }
    }
    
    private void OnTriggerStay(Collider other)
    {
        if (other.CompareTag("Cannon"))
        {
        state = States.InsideCannon;
        }
        }
        `,
      },
      
      {
          name: "DialogueSequence.cs",
          language: "C#",
          description: "This is the Scriptable Object in charge of making a sequence of dialogue that the textbox will follow. It has a string array where you can add different pages of dialogue to in the editor. It has values for the color that the textbox needs to be. It also has possible ending functions, like opening a cannon, starting / ending fights and starting a race",
          code: `
          public string[] dialogue;
          
          public Color textBoxColor;
public Color textColor;

public enum DialogueTypes
{
    Nothing,
    KingBobOmbStartFight,
    KingBobOmbEndFight,
    KoopaTheQuickStartRace,
    KoopaTheQuickWinRace,
    KoopaTheQuickLoseRace,
    PinkBobOmbOpenCannon,
    }
    
    public DialogueTypes dialogueType;
    
    private Mario m_mario;
    
    private GameManager m_gameManager;
    
    private void Awake()
    {
    m_gameManager = FindObjectOfType<GameManager>();
    }

public void EndDialogueFunction()
{
    switch (dialogueType)
    {
        case DialogueTypes.KingBobOmbStartFight:
            KingBobOmb _kingBobOmb = FindAnyObjectByType<KingBobOmb>();
            _kingBobOmb.StartFight();
            break;
            
            case DialogueTypes.KingBobOmbEndFight:
                _kingBobOmb = FindAnyObjectByType<KingBobOmb>();
            _kingBobOmb.EndFight();
            break;
        
        case DialogueTypes.KoopaTheQuickStartRace:
            KoopaTheQuick _koopaTheQuick = FindAnyObjectByType<KoopaTheQuick>();
            _koopaTheQuick.StartRace();
            break;
        
            case DialogueTypes.KoopaTheQuickWinRace:
            _koopaTheQuick = FindAnyObjectByType<KoopaTheQuick>();
            _koopaTheQuick.WinRace();
            break;
            
            case DialogueTypes.KoopaTheQuickLoseRace:
                m_mario = FindObjectOfType<Mario>();
                m_mario.Die();
            break;
            
        case DialogueTypes.PinkBobOmbOpenCannon:
            // Open Cannons
            m_gameManager = FindAnyObjectByType<GameManager>();
            if (!GameManager.Instance.cannonsOpened)
            {
            m_mario = FindObjectOfType<Mario>();
                Animator m_animator = GameObject.Find("Cannon Covers").GetComponent<Animator>();
                m_animator.SetTrigger("openCannon");
                m_mario.canMove = false;
            }
            break;
    }
    }
	`,
},

{
        name: "Textbox.cs",
        language: "C#",
        description: "This is the textbox script that loads in the information from the DialogueSequence that is given to the textbox.",
        code: `
private void Update()
{
    if (!m_textboxExists)
    {
    m_background.color = Color.clear;
        m_text.color = Color.clear;
        }
        }

        public void StartDialogueSequence(DialogueSequence _sequence)
        {
    if (!m_textboxExists)
    {
        m_mario.canMove = false;
        m_textboxExists = true;
        m_sequence = _sequence;
    
        ResetTextbox();
    
        SpawnTextbox(m_sequence.dialogue[m_page]);    
        }
}

private void SpawnTextbox(string _text)
{
    m_background.color = m_sequence.textBoxColor;
    m_text.color = m_sequence.textColor;
    
    m_text.SetText(_text);
    
    m_animator.SetTrigger("textboxIn");
}

public void OnSubmit(InputAction.CallbackContext _context)
{
    if (_context.performed && m_sequence != null)
    {
        print("submit");
        if (m_page < m_sequence.dialogue.Length - 1 && m_textboxExists)
        {
        m_page++;
        SpawnTextbox(m_sequence.dialogue[m_page]);
        }
        else if (m_textboxExists)
        {
        m_sequence.EndDialogueFunction();
        m_animator.SetTrigger("textboxOut");
        m_textboxExists = false;
        m_mario.canMove = true;
        }
        }
        }
        
        private void ResetTextbox()
        {
    m_page = 0;
}
        `,
      },

      {
        name: "GameManager.cs",
        language: "C#",
        description:
          "This is the script that handles the state of the game, star selection and loading the level accordingly based on the star that is selected. It also has the screenshake function I made for Robo Rebellion.",
          code: `
private void Update()
{
    print(starsCollected.Count);
    if (Input.GetKeyDown(KeyCode.B))
    {
        enableDebug = !enableDebug;
        }

    if (Input.GetKeyDown(KeyCode.R))
    {
        if (m_mario != null)
        {
        m_mario.Die();
        }
        
        }
    
    if (Input.GetKeyDown(KeyCode.Escape))
    {
        lockCursor = false;
    }
    
    // UI
    if (m_starsText != null)
    {
        SetStarsText();
        }

    if (m_coinsText != null)
    {
    SetCoinsText();
    }

    // Application
    if (Application.isFocused)
    {
        lockCursor = true;
        }

    Cursor.lockState = lockCursor ? CursorLockMode.Locked : CursorLockMode.None;
}

private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{
    StartCoroutine(SetObjectsWhenReady());
}

private void SetObjects()
{
    currentScene = SceneManager.GetActiveScene().name;
    
    m_canvas = GameObject.Find("Canvas");
    
    if (m_canvas != null)
    {
        foreach (Transform _child in m_canvas.transform)
        {
            if (_child.name == "Background")
            {
                m_backgroundAnimator = _child.GetComponent<Animator>();
                StartTransitionAnimation("fadeOutWhite");
                }
                
                if (_child.name == "Star Select")
                {
                SetStarText();
                }
        }
        }
    
    m_starSelect = GameObject.Find("Star Select");
    m_starObjects = GameObject.Find("Star Objects");
    
    m_mario = FindAnyObjectByType<Mario>();

    if (m_mario != null)
    {
        if (m_starSelect != null)
        {
        m_mario.canMove = false;   
        }
        else
        {
        m_mario.canMove = true;    
        }
        }
    
        m_starsText = GameObject.Find("Stars Text").GetComponent<TextMeshProUGUI>();
        m_coinsText = GameObject.Find("Coins Text").GetComponent<TextMeshProUGUI>();
        
        coinsCollected = 0;
    spawned100CoinStar = false;
    }

    private IEnumerator SetObjectsWhenReady()
    {
    while (GameObject.Find("Canvas") == null)
    {
        yield return null;
    }
    SetObjects();
    }
    
    
    public void StartTransitionAnimation(string _animation)
    {
        if (m_backgroundAnimator != null)
    {
        m_backgroundAnimator.SetTrigger(_animation);
        }
        }
        
        public UnityAction SelectStar(Star _star)
        {
    StartCoroutine(InitializeLevel(_star));
    currentStar = _star;
    
    if (_star.name == "Star 1")
    {
        m_mario.m_kingBobOmbObject = FindAnyObjectByType<KingBobOmb>().gameObject;
        m_mario.m_kingBobOmb = m_mario.m_kingBobOmbObject.GetComponent<KingBobOmb>();
    }
    
    SetStarsText();
    
    return null;
    }

public IEnumerator InitializeLevel(Star _star)
{
    if (m_starSelect == null && m_starObjects == null)
    {
        Debug.Log("zelfm,orod");
        SetObjects();
        yield return new WaitForSeconds(0.1f);
    }
    else
    {
        SetObjects();
        m_starSelect.SetActive(false);
        m_starObjects.SetActive(true);
        m_mario.canMove = true;

        foreach (Transform _child in m_starObjects.transform)
        {
            _child.gameObject.SetActive(false);
        }
        
        if (_star.name == "Star 1")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 1 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }
        
        if (_star.name == "Star 2")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 2 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }

        if (_star.name == "Star 3")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 3 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }
        
        yield return null;
        }
}

public void HoverOverStar(Star _star)
{
    m_canvas = FindAnyObjectByType<Canvas>().gameObject;
    SetStarText();
    m_starText.SetText(_star.starName);
}

private void SetStarText()
{
    GameObject _starText = GameObject.Find("Star Name Text");

    if (_starText != null)
    {
        m_starText = GameObject.Find("Star Name Text").GetComponent<TextMeshProUGUI>();    
    }
}

private void SetStarsText()
{
    m_starsText = GameObject.Find("Stars Text").GetComponent<TextMeshProUGUI>();
    
    if (m_starsText != null)
    {
        m_starsText.SetText("X" + starsCollected.Count);
        }
}

private void SetCoinsText()
{
    m_coinsText = GameObject.Find("Coins Text").GetComponent<TextMeshProUGUI>();
    
    if (m_coinsText != null)
    {
    m_coinsText.SetText("X" + coinsCollected);
    }
}

public void SpawnStar(Star _star, Vector3 _position)
{
    GameObject _starObject = Instantiate(m_starPrefab, new Vector3(_position.x, _position.y, _position.z), Quaternion.identity);

    _starObject.GetComponentInChildren<StarHolder>().star = _star;
    }

public void GetStar(Star _star)
{
    if (!starsCollected.Contains(_star))
    {
        starsCollected.Add(_star);
    }
    
    currentStar = null;
    
    print("starsCollected: " + starsCollected);
}

public void ScreenShake(float _amplitude, float _frequency, float _duration)
{
    m_perlin = GameObject.Find("Player Camera").GetComponent<CinemachineBasicMultiChannelPerlin>();
    
    m_perlin.AmplitudeGain = _amplitude;
    m_perlin.FrequencyGain = _frequency;
    StartCoroutine(ShakeTimer(_duration));
}

private IEnumerator ShakeTimer(float _duration)
{
    yield return new WaitForSeconds(_duration);

    //Reset noise
    m_perlin.AmplitudeGain = 0;
    m_perlin.FrequencyGain = 0;
}
        `,
      },

      {
	name: "Enemy.cs",
	language: "C#",
	description: "",
	code: `
public enum States
{
    Patroling,
    ChargePlayer,
}

public States state = States.Patroling;

private void Awake()
{
    m_mario = FindAnyObjectByType<Mario>();
    m_marioTransform = m_mario.transform;
    agent = GetComponent<NavMeshAgent>();
    m_animator = GetComponentInChildren<Animator>();
    }
    
private void Update()
{
    // Check for sight and attack range
    playerInSightRange = Physics.CheckSphere(transform.position, sightRange, playerLayer);

    if (!playerInSightRange)
    {
        state = States.Patroling;
    }

    if (playerInSightRange)
    {
    state = States.ChargePlayer;
    }
    
    // State switching
    switch (state)
    {
        // Patroling
        case States.Patroling:
            
            if (!walkPointSet)
            {
            SearchWalkPoint();
            }

            if (walkPointSet)
            {
                agent.SetDestination(walkPoint);
            }

            Vector3 distanceToWalkPoint = transform.position - walkPoint;

            // Walkpoint reached
            if (distanceToWalkPoint.magnitude < 1f)
            {
                walkPointSet = false;
            }
            
            if (m_mario.canMove)
            {
                agent.speed = patrolSpeed;
            }
            else
            {
                agent.speed = 0;
            }
            
            break;
            
            // Carge Player
            case States.ChargePlayer:
            
                if (m_mario.canMove)
            {
                agent.SetDestination(m_marioTransform.position);
                agent.speed = runSpeed;    
            }
            else
            {
                agent.speed = 0;
            }
            
            break;
    }
}

private void SearchWalkPoint()
{
    // Calculate random point in range
    float randomZ = Random.Range(-walkPointRange, walkPointRange);
    float randomX = Random.Range(-walkPointRange, walkPointRange);
    
    walkPoint = new Vector3(transform.position.x + randomX, transform.position.y, transform.position.z + randomZ);
    
    if (Physics.Raycast(walkPoint, -transform.up, 2f, groundLayer))
    {
    walkPointSet = true;
    }
    }
    
    private void OnDrawGizmosSelected()
{
    Gizmos.color = Color.yellow;
    Gizmos.DrawWireSphere(transform.position, sightRange);
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere(transform.position, walkPointRange);
    }

    private void DamagePlayer(int _damageAmount)
    {
        m_mario.TakeDamage(_damageAmount);
        }

        public void TakeDamage(int _damageAmount)
        {
            hp -= _damageAmount;
            
            if (hp <= 0)
            {
            Die();
            }
}

private void Die()
{
    gameObject.SetActive(false);
    }
	`
},

{
	name: "KingBobOmb.cs",
	language: "C#",
	description: "",
	code: `
    public enum States
    {
	Idle,
	Walking,
	Grabbing,
	Throwing,
	Grabbed,
	Thrown,
    }
    
    public States state = States.Idle;
    
    [SerializeField] private Star m_kingBobOmbStar;
    
    private void Awake()
    {
        m_mario = FindAnyObjectByType<Mario>();
	m_marioTransform = m_mario.transform;
	agent = GetComponent<NavMeshAgent>();
	m_animator = GetComponentInChildren<Animator>();
	m_gameManager = FindAnyObjectByType<GameManager>();
	m_textbox = FindAnyObjectByType<Textbox>();
    }
    
    private void Update()
    {
        isGrounded = Physics.Raycast(transform.position, Vector3.down, 0.5f, groundLayer);
	
	switch (state)
	{
		case States.Idle:
            if (goToWalkTimer > 0)
			{
				goToWalkTimer -= Time.deltaTime;
			}
			else
                {
				state = States.Walking;
                }
			break;
			
		case States.Walking:
            if (stage > 0 && stage < 3)
			{
            agent.SetDestination(walkPoint);
            
            if (setWalkPointTimer > 0)
            {
					setWalkPointTimer -= Time.deltaTime;
                    }
                    else
				{
					SetWalkPoint(m_marioTransform.position);
					setWalkPointTimer = setWalkPointTimerDuration;
				}

				if (stage < 2)
				{
                agent.angularSpeed = 75;
				}
				else
				{
					agent.angularSpeed = 180;
					setWalkPointTimerDuration = 0.25f;
                    }    
			}
			else
                {
            state = States.Idle;
			}
			break;
		
            case States.Grabbed:
                
			break;
		
		case States.Thrown:
			if (isGrounded)
			{
				state = States.Walking;
				stage++;
				m_gameManager.ScreenShake(10,10,0.25f);
                }
                break;
                }

	if (stage > 3)
	{
    m_textbox.StartDialogueSequence(m_loseDialogueSequence);
    stage = -1;
	}
}

private void SetWalkPoint(Vector3 _walkPoint)
{
	walkPoint = _walkPoint;
    }

    public void StartFight()
{
	state = States.Walking;
	stage = 1;
    }
    
    public void EndFight()
{
	GameManager.Instance.SpawnStar(m_kingBobOmbStar, new Vector3(transform.position.x, transform.position.y + 2.5f, transform.position.z));
	gameObject.SetActive(false);
}
`
},

{
	name: "KoopaTheQuick.cs",
	language: "C#",
	description: "",
	code: `
private void Update()
{
	print(racing);
	
	if (racing)
	{
    float _remainingDist = Vector3.Distance(transform.position, waypoints[m_currentWaypoint].position);
    
    if (_remainingDist <= 1f  &&  m_currentWaypoint < waypoints.Length - 1)
    {
    m_currentWaypoint++;
    SetWaypoint();
    }
    
	}
	
	print(m_currentWaypoint);
    }
    
    public void StartRace()
{
	racing = true;
	SetWaypoint(); 
	m_raceManager= FindAnyObjectByType<RaceManager>();
	m_raceManager.StartRace();
}

private void SetWaypoint()
{
	print("SET WAYPOINT 5 BIG BOOOOMB");
	m_agent.destination = waypoints[m_currentWaypoint].position;
}

private void OnTriggerEnter(Collider other)
{
	if (other.CompareTag("Top Hitbox"))
	{
		if (m_raceManager.raceState == RaceManager.RaceStates.Racing)
		{
			m_raceManager.raceState = RaceManager.RaceStates.Lost;
			
			m_textbox.StartDialogueSequence(m_lostDialogue);
            }
            
            if (m_raceManager.raceState == RaceManager.RaceStates.Won)
            {
			m_textbox.StartDialogueSequence(m_wonDialogue);
            }
            }
            }
            
            public void WinRace()
            {
	m_agent.enabled = false;
	print("race gewonnen :O");
	GameManager.Instance.SpawnStar(m_star, new Vector3(transform.position.x, transform.position.y + 2.5f, transform.position.z));
	racing = false;
	gameObject.SetActive(false);
}
	`
}
    ],
  },

  
  // Bombs Per Minute (BPM) //
  {
      title: "Bombs Per Minute",
      slug: "bpm",
      banner: "/images/bpm banner.webp",
      icon: "/images/bpm icon.webp",
      date: "2025-10-06",
      displayDate: formatDisplayDate("2025-10-06"),
      platform: "Itch.io",
      description:
      "Bombs Per Minute is a rhythm game made with notes and bombs made in godot. It's a work in progress that still lacks the map editor and some score calculations, but I'm still proud of it. \n\nWhat i made: \n- Conductor script responsible for handling bpm, time signatures and beat calculations \n- Charter script responsible for placing notes and bombs in the level based on the beat calculations from the Conductor and note data from the map file \n- Song manager script responsible for holding data like combo, multipliers, score and health \n- Note script that gets spawned by the Charter with a type that can be: Normal or Bomb \n- Lane script responsible for hit detection of the notes \n- Globals script responsible for holding global data like the current user's name\n- Database script to send the information of the map you beat to the database \n- Settings menu that saves data the Globals \n- Result screen that shows your score, accuracy, max combo and rank on the current song \n\nWork In Progress: \n- Map Editor (can only make the map json files at the moment) \n- More songs made with the new map editor so the game has playable content that isn't made in a text editor",
  
      //href: "https://linkerpink.itch.io/bombs-per-minute",
      github: "https://github.com/Linkerpink/Bombs-Per-Minute",
  
      technologies: ["/images/godot logo.svg", "/images/gdscript logo.webp"],
  
      media: [
      { type: "image", src: "/images/bpm.webp" },
      { type: "youtubeId", src: "NfxPphgsxag", title: "Launch Trailer" },
      ],
  
      featured: true,
  
      codeSnippets: [
        {
            name: "conductor.gd",
            language: "gdscript",
            description:
            "This is the Conductor script responsible for handling bpm, time signatures and beat calculations",
            code: `
extends AudioStreamPlayer
class_name Conductor

#region Variables
var song_bpm : int # The beats per minute in the song
var song_measures : int # The amount of measures in a beat. For a 4/4 time signature, this would be 4
var song_scroll_speed : float
@export var song_audio : AudioStream
@onready var charter = %Charter

var song_position = 0.0
var song_position_in_beats = 1
var seconds_per_beat
var last_reported_beat = 0
var beats_before_start = 0
var current_measure = 0

var closest = 0
var time_off_beat = 0.0

@onready var start_timer : Timer = $"Start Timer"

signal beat(position)
signal measure(position)

@onready var song_position_in_beats_text : RichTextLabel = $"../Song UI/MarginContainer/Debug UI/Song Position In Beats Text"
@onready var current_measure_text : RichTextLabel = $"../Song UI/MarginContainer/Debug UI/Current Measure Text"

@onready var song_manager : SongManager = %"Song Manager"
#endregion

func _ready() -> void:
globals.set_results(0, 0, 0, 0, 0, 0, false)
song_bpm = charter.map.bpm
song_measures = charter.map.measures
song_scroll_speed = charter.map.scroll_speed
seconds_per_beat = 60.0 / song_bpm
stream = charter.map.audio
if song_audio != null:
    stream = song_audio
else:
    push_error("No song audio selected for this song!")

func _physics_process(delta: float) -> void:
if playing:
    song_position = get_playback_position() + AudioServer.get_time_since_last_mix()
    song_position -= AudioServer.get_output_latency()
    song_position_in_beats = int(floor(song_position / seconds_per_beat)) + beats_before_start
    _report_beat()
    _update_ui()
if not playing and song_position_in_beats > 1:
    var sm = song_manager
    globals.set_results(sm.score, sm.accuracy, sm.best_combo, sm.notes_hit, sm.bombs_hit, sm.notes_missed, true)
    get_tree().change_scene_to_file("res://scenes/result_screen.tscn")

func _report_beat():
if last_reported_beat < song_position_in_beats:
    if current_measure > song_measures - 1:
        current_measure = 0
    emit_signal("beat", song_position_in_beats)
    emit_signal("measure", current_measure)
    last_reported_beat = song_position_in_beats
    current_measure += 1

func note_to_time(measure: int, beat: int, subdivision: int, bpm: float, beats_per_measure: int, subdivision_size: int):
var seconds_per_beat = 60.0 / bpm
var total_beats = measure * beats_per_measure + beat + (float(subdivision) / subdivision_size)
return total_beats * seconds_per_beat

func play_with_beat_offset(_num):
beats_before_start = _num
start_timer.wait_time = seconds_per_beat
start_timer.start()

func play_from_beat(beat: int, measure: int = 0) -> void:
var total_beats = measure * song_measures + beat
var start_time = total_beats * seconds_per_beat

play()
seek(start_time)

song_position = start_time
song_position_in_beats = total_beats
last_reported_beat = total_beats
current_measure = measure

func _on_beat(position: Variant) -> void:
#print("beat")
pass

func _on_measure(position: Variant) -> void:
#print(current_measure)
pass

func _on_start_timer_timeout() -> void:
song_position_in_beats += 1
if song_position_in_beats < beats_before_start - 1:
    start_timer.start()
elif song_position_in_beats == beats_before_start -1:
    start_timer.wait_time = start_timer.wait_time - (AudioServer.get_time_to_next_mix() + AudioServer.get_output_latency())
    start_timer.start()
else:
    #play_from_beat(75)
    play()
    start_timer.stop()
_report_beat()

func _update_ui():
song_position_in_beats_text.text = "Song position in beats: " + str(song_position_in_beats)
current_measure_text.text = "Current measure: " + str(current_measure)
pass

`
        },

        {
            name: "charter.gd",
            language: "gdscript",
            description:
            "This is the Charter script responsible for placing notes and bombs in the level based on the beat calculations from the Conductor and note data from the map file",
            code: `
            extends Node
class_name Charter

@export var map : Map
@onready var note_scene : PackedScene = preload("res://scenes/note.tscn")
@onready var conductor : Conductor = %Conductor
@export var note_spawn_ahead : float = 2.0
@onready var lanes : Array = %"Lanes Holder".get_children()

var note_index := 0
var active_notes := []

func _ready() -> void:
map = globals.current_map
for note in map.notes:
    note["time"] = conductor.note_to_time(
        note["measure"],
        note["beat"],
        note["subdivision"],
        map.bpm,
        map.measures,
        map.subdivision_size
    )

func _process(delta: float) -> void:
if conductor.playing and note_index < map.notes.size():
    var current_time = conductor.song_position
    var next_note = map.notes[note_index]

    if current_time >= next_note["time"] - note_spawn_ahead:
        spawn_note(next_note)
        note_index += 1

func spawn_note(note_data: Dictionary):
var note = note_scene.instantiate()
add_child(note)

var lane_node = lanes[note_data["lane"]]
note.position = Vector2(lane_node.position.x, -720)

note.set("hit_time", note_data["time"])
note.set("type", note_data["type"])
note.set("end_beat", note_data["end_beat"])
note.set("end_subdivision", note_data["end_subdivision"])

active_notes.append(note)

`
        },

        {
            name: "song_manager.gd",
            language: "gdscript",
            description:
            "This is the Song manager script responsible for holding data like combo, multipliers, score and health",
            code: `
extends Node2D
class_name SongManager

var score : int = 0
var accuracy : float = 100.0
var combo : int = 0
var best_combo : int = 0
var combo_multiplier : int = 1

var notes_hit : int
var notes_missed : int = 0
var bombs_hit : int = 0

var score_text : RichTextLabel 
var combo_text : RichTextLabel
var combo_multiplier_text : RichTextLabel

var hp : int = 100
@onready var hp_progress_bar : TextureProgressBar = %"Song UI".find_child("Hp Progress Bar")

var exit_timer = 0
@onready var exit_progress_bar : TextureProgressBar = %"Song UI".find_child("Exit Progress Bar")

@onready var charter : Charter = %Charter

func _ready() -> void:
score_text = get_tree().get_first_node_in_group("score_text")
combo_text = get_tree().get_first_node_in_group("combo_text")
combo_multiplier_text = get_tree().get_first_node_in_group("combo_multiplier_text")

score_text.text = "Score: " + str(score)
combo_text.text = "Combo: " + str(combo)
combo_multiplier_text.text = "x[color=blue]" + str(combo_multiplier)

func _process(delta: float) -> void:
if Input.is_action_pressed("menu_back"):
    exit_timer += delta
elif exit_timer > 0:
    exit_timer -= delta
    
exit_progress_bar.value = exit_timer * 200
    
if exit_timer >= 0.5:
    get_tree().change_scene_to_file("res://scenes/main_menu.tscn")

func hit_note(_amount : int):
notes_hit += 1
score += _amount * combo_multiplier
_handle_combo()
_change_hp(2.5)
#_calculate_accuracy()

func hit_bomb():
bombs_hit += 1
break_combo()

func miss_note():
notes_missed += 1
break_combo()
_change_hp(-5)

func break_combo():
combo = 0
combo_multiplier = 1
score_text.text = "Score: " + str(score)
combo_text.text = "combo: " + str(combo)
_handle_combo_multiplier_text()

func _change_hp(_value : int):
hp += _value
hp_progress_bar.value = hp

if hp > 100:
    hp = 100
    
if hp <= 0:
    _die()
    
func _calculate_accuracy():
var _remaining_notes = charter.map.notes.size() - charter.map.notes[charter.note_index].size()
for note in charter.map.notes:
    pass

func _die():
globals.set_results(score, accuracy, best_combo, notes_hit, bombs_hit, notes_missed, false)
get_tree().change_scene_to_file("res://scenes/result_screen.tscn")

func _handle_combo():
combo += 1

if combo > best_combo:
    best_combo = combo

score_text.text = "Score: " + str(score)
combo_text.text = "combo: " + str(combo)

match combo:
    0:
        combo_multiplier = 1
        _handle_combo_multiplier_text()
    10:
        combo_multiplier = 2
        _handle_combo_multiplier_text()
    20:
        combo_multiplier = 3
        _handle_combo_multiplier_text()
    30:
        combo_multiplier = 4
        _handle_combo_multiplier_text()

func _handle_combo_multiplier_text():
match combo_multiplier:
    1:
        combo_multiplier_text.text = "x[color=cyan]" + str(combo_multiplier)
    2:
        combo_multiplier_text.text = "x[color=orange]" + str(combo_multiplier)
    3:
        combo_multiplier_text.text = "x[color=green]" + str(combo_multiplier)
    4:
        combo_multiplier_text.text = "x[color=purple]" + str(combo_multiplier)

`
        },

        {
            name: "note.gd",
            language: "gdscript",
            description:
            "This is the Note script that gets spawned by the Charter with a type that can be: Normal or Bomb",
            code: `
extends Node2D

var conductor : Conductor
var scroll_speed : float
var hit_time : float = 0.0
var type : String = "note"
var end_beat : int = 0
var end_subdivision : int = 0

@onready var normal : Node2D = %Normal
@onready var bomb : Node2D = %Bomb
@onready var setup_timer : Timer = %"Setup Timer"
@onready var end_point : Node2D = %"End Point"
@onready var line : Line2D = %Line2D

signal hit_note

func _ready() -> void:
conductor = get_tree().get_first_node_in_group("conductor")
scroll_speed = conductor.song_scroll_speed

func _process(delta: float) -> void:
if conductor == null:
    push_error("conductor not found in note!")
var time_until_hit = hit_time - conductor.song_position
position.y = 200 - time_until_hit * scroll_speed

#if type == "long":
    #line.set_point_position(1,end_point.position)

func _on_setup_timer_timeout() -> void:
#if (end_beat > 0):
    #type = "long"

match type:
    "note":
        normal.show()
        bomb.queue_free()
    "bomb":
        bomb.show()
        normal.queue_free()
    #"long":
        #normal.show()
        #bomb.queue_free()
        #line.add_point(end_point.position)

`
        },

        {
            name: "lane.gd",
            language: "gdscript",
            description:
            "This is the Lane script responsible for hit detection of the notes.",
            code: `
extends Node2D

@export var hit_key : String
@export var input_value : String
@onready var sprite : Sprite2D = %"Hit Window Sprite"
@onready var input_text : RichTextLabel = %"Input Text"

@onready var hit_score_animation_player : AnimationPlayer = %"Hit Score Animation Player"
@onready var hit_score_text : RichTextLabel = %"Hit Score Text"

@onready var hit_effect_animation_player : AnimationPlayer = %"Hit Effect Animation Player"

@onready var song_manager : SongManager = %"Song Manager"
@onready var beat_indicator_scene : PackedScene = preload("res://scenes/beat_indicator.tscn")

enum note_score_states
{
None,
Perfect,
Good,
Okay,
Bomb,
}

var note_score_state : note_score_states = note_score_states.None

var colliding_note : Area2D

func _ready() -> void:
input_text.text = input_value

func _process(delta: float) -> void:
if Input.is_action_just_pressed(hit_key):
    pass #Animate

if Input.is_action_just_pressed(hit_key):
    match note_score_state:
        note_score_states.Perfect:
            _hit_note(300)
            hit_score_text.text = "[color=purple]Perfect!"
        note_score_states.Good:
            _hit_note(200)
            hit_score_text.text = "[color=green]Good!"
        note_score_states.Okay:
            _hit_note(100)
            hit_score_text.text = "[color=orange]OK."
        note_score_states.Bomb:
            _hit_bomb()
            hit_score_text.text = "[shake][color=red]KABOOM!"
        note_score_states.None:
            _miss_note()
            hit_score_text.text = "[color=red]Miss."

func _hit_note(_amount : int): 
print("hit noted")
colliding_note.get_parent().get_parent().queue_free()
colliding_note = null
_play_hit_score_animation()
song_manager.hit_note(_amount)
hit_effect_animation_player.stop()
hit_effect_animation_player.play("hit_effect")

func _miss_note():
_play_hit_score_animation()
song_manager.miss_note()

func _hit_bomb():
print("hit_bomb")
song_manager.hit_bomb()
colliding_note.get_parent().queue_free()
_play_hit_score_animation()
colliding_note = null

func _play_hit_score_animation():
hit_score_animation_player.stop()
hit_score_animation_player.play("hit_score")

func _on_hit_window_area_entered(area: Area2D) -> void:
if area.is_in_group("perfect"):
    note_score_state = note_score_states.Perfect
    colliding_note = area

if area.is_in_group("good"):
    if note_score_state != note_score_states.Perfect:
        note_score_state = note_score_states.Good
        colliding_note = area

if area.is_in_group("okay"):
    if note_score_state != note_score_states.Perfect and note_score_state != note_score_states.Good:
        note_score_state = note_score_states.Okay
        colliding_note = area

if area.is_in_group("bomb"):
    note_score_state = note_score_states.Bomb
    colliding_note = area

func _on_hit_window_area_exited(area: Area2D) -> void:
if area.is_in_group("perfect"):
    note_score_state = note_score_states.None

if area.is_in_group("good"):
    note_score_state = note_score_states.None

if area.is_in_group("okay"):
    note_score_state = note_score_states.None
    
if area.is_in_group("bomb"):
    note_score_state = note_score_states.None

colliding_note = null

func _on_conductor_beat(position: Variant) -> void:
pass
#var _beat_indicator = beat_indicator_scene.instantiate()
#add_child(_beat_indicator)

func _on_miss_trigger_area_exited(area: Area2D) -> void:
if area.is_in_group("okay"):
    area.queue_free()
    note_score_state = note_score_states.None
    hit_score_text.text = "[color=red]Miss."
    _miss_note()
    
if area.is_in_group("bomb"):
    area.queue_free()

`
        },

        {
            name: "globals.gd",
            language: "gdscript",
            description:
            "This is the Globals script responsible for holding global data like the current user's name",
            code: `
extends Node

var users : Array[String] = ["Guest"]
var current_user : String

var current_map : Map
var cm_rank : String = "SS"
var cm_score : int
var cm_best_combo : int
var cm_accuracy : float
var cm_notes_hit : int
var cm_bombs_hit : int
var cm_notes_missed : int

var cm_passed : bool = false

func _ready() -> void:
current_user = users[0]

func _process(delta: float) -> void:
if Input.is_action_just_pressed("restart"):
    get_tree().reload_current_scene()

func add_user(_user : String):
users.append(_user)

func set_results(_score, _acc : float, _best_combo : int, _notes_hit : int, _bombs_hit : int, _notes_missed : int, _passed : bool):
cm_score = _score
cm_accuracy = _acc
cm_best_combo = _best_combo
cm_notes_hit = _notes_hit
cm_bombs_hit = _bombs_hit
cm_notes_missed = _notes_missed
cm_passed = _passed

`
        },

        {
            name: "db.gd",
            language: "gdscript",
            description:
            "This is the Database script to send the information of the map you beat to the database",
            code: `
extends Node

var api_url = "http://localhost/bombs-per-minute/api.php"

func send_score():
	var data = {
		"user": globals.current_user,
		"map": globals.current_map.name,
		"rank": globals.cm_rank,
		"accuracy": globals.cm_accuracy,
		"score": globals.cm_score,
		"best_combo": globals.cm_best_combo,
		"notes_hit": globals.cm_notes_hit,
		"bombs_hit": globals.cm_bombs_hit,
		"notes_missed": globals.cm_notes_missed
	}

	var http := HTTPRequest.new()
	add_child(http)

	var body = JSON.stringify(data)
	var headers = ["Content-Type: application/json"]

	http.request(api_url, headers, HTTPClient.METHOD_POST, body)
	http.request_completed.connect(_on_request_completed)


func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var text = body.get_string_from_utf8()
		var parsed = JSON.parse_string(text)
		if typeof(parsed) == TYPE_DICTIONARY:
			print("Insert OK, id:", parsed.get("insert_id"))
		else:
			print("Unexpected response:", text)
	else:
		print("HTTP Error:", response_code)

`
        },

      ]
  },

  // The Royal Spin //
  {
    title: "The Royal Spin",
    slug: "the-royal-spin",
    banner: "/images/the royal spin banner.png",
    icon: "/images/the royal spin logo.png",
    date: "2025-07-14",
    displayDate: formatDisplayDate("2025-07-14"),
    platform: "Itch.io",
    description:
    "The Royal Spin is a game made by a group of 4 students. \n\nGamble and drink your heart out to pay rent and turn the tide with powerful spell cards. In this game you play Slots, Roulette and Russian Roulette. The goal is buying keys to escape. \n\nDevelopers: \n[Mark Biesheuvel](https://sites.google.com/view/mark-biesheuvel-portfolio) \n[Noah van Uunen](https://linkerpink.vercel.app/) \n\nArtists: \n[Belle Bunnik](https://www.artstation.com/bellebunnik) \n[Jordy Andriessen](https://www.artstation.com/sekerio) \n\nWhat I made: \n- Game Settings \n- Shop \n- GameManager script that holds the game state and displays the items in the player's inventory at that moment \n- Russian Roulette \n- Rent system \n- Sound System \n- Keys & Doors \n- Main Menu camera sequences",
    href: "https://linkerpink.itch.io/the-royal-spin",
    github: "https://github.com/MarkBSH/Suicide-Squad",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],
    
    media: [
      { type: "image", src: "/images/the royal spin logo.png" },
      { type: "image", src: "/images/trs 1.jpg" },
      { type: "image", src: "/images/trs 2.jpg" },
      { type: "image", src: "/images/trs 3.jpg" },
      { type: "image", src: "/images/trs 4.jpg" },
      { type: "image", src: "/images/trs 5.jpg" },
      { type: "youtubeId", src: "T5x7aK-R4FY", title: "Gameplay Video" },
    ],

    featured: true,
    
    codeSnippets: [
{
	name: "SettingsManager.cs",
	language: "C#",
	description: "This is the script that manages player settings. The current player settings and default player settings are stored in a Scriptable Object, that then gets loaded when the game loads a scene.",
	code: `
    private void Start()
    {
	LoadPlayerSettings();
    
	if (playerSettings.fieldOfView < 10)
	{
		LoadDefaultSettings();
	}
}

private void FindObjects()
{
	m_playerCam = FindAnyObjectByType<FirstPersonCam>();
	if (m_playerCam != null)
	{
    m_playerCam.m_MouseSensitivity = playerSettings.mouseSensitivity;
		m_playerCam.GetComponent<Camera>().fieldOfView = playerSettings.fieldOfView;
        }
}

public void ChangeViewBobbing()
{
	playerSettings.viewBobbingEnabled = m_viewBobbingSlider.value;
	UpdateSettingsUI();
	SavePlayerSettings();
    }
    
    public void ChangeMouseSens(float _value)
    {
        playerSettings.ChangeMouseSensitivity(_value);
        UpdateSettingsUI();
        SavePlayerSettings();
        }
        
        public void ChangeCameraFOV(float _value)
        {
            playerSettings.ChangeFieldOfView(_value);
            UpdateSettingsUI();
            SavePlayerSettings();
            }
            
            public void LoadDefaultSettings()
            {
                ChangeMouseSens(defaultSettings.mouseSensitivity);
	ChangeCameraFOV(defaultSettings.fieldOfView);

	SavePlayerSettings();
	UpdateSettingsUI();
}

public void UpdateSettingsUI()
{
	m_mouseSensText.SetText("Mouse Sensitivity: " + playerSettings.mouseSensitivity.ToString());
	m_mouseSensSlider.value = playerSettings.mouseSensitivity;
    
	m_camFOVText.SetText("Camera Field Of View: " + playerSettings.fieldOfView.ToString());
	m_camFOVSlider.value = playerSettings.fieldOfView;
	
	// m_viewBobbingText.SetText("View Bobbing: " + playerSettings.viewBobbingEnabled.ToString());
	// m_viewBobbingSlider.value = playerSettings.viewBobbingEnabled;
    }
    
    public void SavePlayerSettings()
    {
        PlayerPrefs.SetFloat("Mouse Sensitivity", playerSettings.mouseSensitivity);
        PlayerPrefs.SetFloat("Field Of View", playerSettings.fieldOfView);
        //PlayerPrefs.SetFloat("View Bobbing Enabled", playerSettings.viewBobbingEnabled);
        PlayerPrefs.Save();
        
        FindObjects();
        }
        
        public void LoadPlayerSettings()
        {
            if (PlayerPrefs.HasKey("Mouse Sensitivity"))
	{
		playerSettings.mouseSensitivity = PlayerPrefs.GetFloat("Mouse Sensitivity");
        }
        else
            {
		PlayerPrefs.SetFloat("Mouse Sensitivity", defaultSettings.mouseSensitivity);
		playerSettings.mouseSensitivity = PlayerPrefs.GetFloat("Mouse Sensitivity");
        }
    
	if (PlayerPrefs.HasKey("Field Of View"))
	{
    playerSettings.fieldOfView = PlayerPrefs.GetFloat("Field Of View");
	}
	else
        {
		PlayerPrefs.SetFloat("Mouse Sensitivity", defaultSettings.mouseSensitivity);
		playerSettings.fieldOfView = PlayerPrefs.GetFloat("Field Of View");
	}
    }
`
},

{
    name: "GameManager.cs",
	language: "C#",
	description: "This is the GameManager script that can pause the game, locks / unlocks cursor and displays the items in the player's inventory at that moment ",
	code: `
    #region Common GameManager Functions
    
    public void ChangeScene(string _scene)
    {
        SceneManager.LoadScene(_scene);
}

public void LockCursor()
{
	Cursor.lockState = CursorLockMode.Locked;
    }
    
    public void UnlockCursor()
    {
        Cursor.lockState = CursorLockMode.None;
        }

        public void EnablePause()
        {
	if (FindAnyObjectByType<PlayerInteracting>())
	{
		m_playerInteracting = FindAnyObjectByType<PlayerInteracting>();
        }

	if (currentScene != "Main Menu" && !m_playerInteracting.m_IsInteracting)
	{
    if (!paused)
		{
			PauseGame();
		}
		else
            {
			UnpauseGame();
		}
        }
        }
        
        public void PauseGame()
        {
	paused = true;
	Time.timeScale = 0;

	if (UIManager.Instance.pauseUI != null)
	{
		UIManager.Instance.pauseUI.SetActive(true);
	}

	UnlockCursor();
}

public void UnpauseGame()
{
	paused = false;
	Time.timeScale = 1;

	if (UIManager.Instance.pauseUI != null)
	{
    UIManager.Instance.pauseUI.SetActive(false);
	}

	LockCursor();
    }
    
    #endregion
    
    #region Shop & Items

    public void BuyItem(Item _item)
    {
        if (money >= _item.itemCost)
	{
		// Look if the player has the item and if it's allowed to have duplicates of the same time in the inventory
		if (items.ContainsKey(_item) && !_item.duplicatesAllowed)
		{
        Debug.Log("Can only buy one of this item");
		}
		else
		{
			// Buy Item
			if (_item.itemType == Item.ItemType.Default)
			{
				AddItem(_item);
			}
			else if (_item.itemType == Item.ItemType.SpellPack)
			{
            RandomSpellGiver.Instance.SetupSpellGiver();
			}
			else if (_item.itemType == Item.ItemType.Alchohol)
			{
            FindAnyObjectByType<DrunkEffect>().Drink();
			}
            
			RemoveMoney(_item.itemCost);
            }
            }
            else
	{
            Debug.Log("Not enough money");
	}
    }

    public void AddItem(Item _item)
{
	if (!items.ContainsKey(_item))
	{
    items.Add(_item, 0);
	}
	else
        {
    items[_item]++;
	}

	UpdateItemUI();
    }
    
    public void RemoveItem(Item _item)
    {
        if (items.ContainsKey(_item))
	{
    if (items[_item] > 0)
		{
    items[_item]--;
            }
            else
                {
			items.Remove(_item);
		}
	}
	else
	{
    Debug.LogError($"Trying to remove an item that doesn't exist in the items dictionary :( Item name: {_item.name}");
    
    foreach (var kvp in items)
		{
			Debug.Log($"Inventory item: {kvp.Key.name} x{kvp.Value}");
            }
        }
        

        UpdateItemUI();
        }

        public Item TryGetItem(string _name)
        {
	bool _found = false;
    
	foreach (Item _item in items.Keys)
	{
		if (_item.name == _name && !_found)
		{
        _found = true;
        return _item;
		}
	}
    
	return null;
    }
    
    public void EnableShopUI()
    {
        m_shopManager.shopUI.SetActive(true);
        
	UnlockCursor();
    }
    
    public void DisableShopUI()
    {
	m_shopManager = FindAnyObjectByType<ShopManager>();
	m_shopManager.shopUI.SetActive(false);

	if (RandomSpellGiver.Instance.m_spellScreenActive == false)
	{
    LockCursor();
        }
        }
        
private void UpdateItemUI()
{
	if (m_itemUI != null)
	{
    foreach (Transform _child in m_itemUI.transform)
		{
			// Make sure there are no item icons left
			Destroy(_child.gameObject);
            }
            
            foreach (Item _item in items.Keys)
            {
                if (_item.itemType != Item.ItemType.SpellPack)
                {
				GameObject _itemIconObject = Instantiate(m_itemIconPrefab);
				_itemIconObject.transform.SetParent(m_itemUI.transform);
                
				Image _itemIcon = _itemIconObject.GetComponent<Image>();
				_itemIcon.sprite = _item.itemIcon;
                
				TextMeshProUGUI _itemAmountText = _itemIconObject.GetComponentInChildren<TextMeshProUGUI>();
                
				int _amount;
                
				if (items.ContainsKey(_item))
				{
                _amount = items[_item] + 1;
				}
				else
                    {
					_amount = 0;
                    }
                    
				_itemAmountText.SetText(_amount.ToString());
			}
		}
        }
	else
	{
    Debug.LogError("Item UI not found!");
	}
}

private IEnumerator DisableShopUICoroutine()
{
	yield return new WaitForSeconds(0.25f);
	DisableShopUI();
}

#endregion
	`
},

{
	name: "RussianRoulette.cs",
	language: "C#",
	description: "This is the script for handling russian roulette. Some of the functions are used in animations as events.",
	code: `
    public void StartRussianRouletteSetup()
    {
        if (!playedRoulette)
        {
		m_animator.SetTrigger("Start Russian Roulette Intro");
		m_interactableCameras.EnableCamera();
		completedRussianRouletteSetup = false;
	}
	
	m_tableGun.SetActive(false);
	AudioManager.Instance.Stop("bg music");
	AudioManager.Instance.Play("piano slam");
	AudioManager.Instance.Play("heart beat");
    }

    public void CompleteRussianRouletteSetup()
    {
	completedRussianRouletteSetup = true;
	m_ableToCloseRoulette = true;
    }
    
    public void StartRussianRoulette()
    {
        if (!playedRoulette)
	{
		FindAnyObjectByType<PlayerStartInteract>().ClearControlsUIHolder();
        
		int _rnd = 1;
		if (!GameManager.Instance.m_IsInstaWin)
		{
        _rnd = Random.Range(0, 5);
		}
		else
            {
			GameManager.Instance.m_IsInstaWin = false;
            }
            
		if (_rnd == 0)
		{
        RouletteDeath();
		}
		else
		{
			RouletteWin();
		}

		completedRussianRouletteSetup = true;
		m_ableToCloseRoulette = false;
	}
    }
    
    public void CloseRussianRoulette()
{
	if (completedRussianRouletteSetup && m_ableToCloseRoulette)
	{
    if (GetComponentInChildren<InteracteblesCameras>())
		{
    GetComponentInChildren<InteracteblesCameras>().DisableCamera();
		}
        
		completedRussianRouletteSetup = false;
		print("closed Russian Roulette");

		m_txt = "";
        
		m_animator.SetTrigger("Close Russian Roulette");
        
		AudioManager.Instance.Play("bg music");
		AudioManager.Instance.Stop("heart beat");
		m_tableGun.SetActive(true);
	}
}

private void RouletteDeath()
{
	m_animator.SetTrigger("Roulette Death");

	// Destroy object instead of set active, caused weird interact issues
	Destroy(GetComponentInChildren<BoxCollider>().gameObject);
	FindAnyObjectByType<PlayerInteracting>().m_InteractLink = null;
	playedRoulette = true;
}

private void RouletteWin()
{
	m_animator.SetTrigger("Win Russian Roulette");
    
	// Destroy object instead of set active, caused weird interact issues
	Destroy(GetComponentInChildren<BoxCollider>().gameObject);
	playedRoulette = true;
}

public void RouletteWinEvent()
{
	CloseRussianRoulette();
	print(hasSeenEscapeSequence);
    
	if (!hasSeenEscapeSequence)
	{
		if (FindAnyObjectByType<PlayerInteracting>())
		{
			FindAnyObjectByType<PlayerInteracting>().StartCoroutine(FindAnyObjectByType<PlayerInteracting>().CloseCoolDown(0f));
		}

		hasSeenEscapeSequence = true;
		FindAnyObjectByType<PlayerInteracting>().m_InteractLink = null;
		FindAnyObjectByType<PlayerStartInteract>().CreateControlsUI("B", "- Spell Book", false);
		m_gameManager.ChangeCamera(playerCamera, escapeCamera, escapeCamera.transform.position, escapeCamera.transform.rotation, escapeCamera.fieldOfView);
		GameObject.FindWithTag("EntranceDoorTrigger").GetComponent<Animator>().SetTrigger("doorOpen");
		AudioManager.Instance.Stop("heart beat");
		StartCoroutine(GoToEnding(7.5f));
	}
}

public void RouletteDeathEvent()
{
	FindAnyObjectByType<FirstPersonMovement>().Die();
	AudioManager.Instance.Stop("heart beat");
}

private IEnumerator GoToEnding(float _delay)
{
	yield return new WaitForSeconds(_delay);
	SceneManager.LoadScene("Main Menu");
}
	`
},

{
	name: "AudioManager.cs",
	language: "C#",
	description: "This is the script that handles the functions for sounds. It is based on the simple sound system I made for my game: Shy.",
	code: `
private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{ 
	foreach(Sound s in sounds)
	{
		s.source = gameObject.AddComponent<AudioSource>();
		s.source.clip = s.clip;

		s.source.volume = s.volume;
		s.source.pitch = s.pitch;
		s.source.loop = s.loop;
	}
    }
    
    public void Play(string _name)
    {
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
        }
        s.source.Play();
}

public void Stop(string _name)
{
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.Stop();
    }

    public void StopAll()
{
	foreach (Sound s in sounds)
	{
		s.source.Stop();
	}
}

public void SetVolume(float _volume, string _name)
{
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.volume = _volume;
}
	`
},

    ],
  },
  
  // When Time Collides //
  {
    title: "When Time Collides",
    slug: "when-time-collides",
    banner: "/images/When Time Collides HD Cover Art.png",
    icon: "/images/when time collides icon.webp",
    date: "2022-03-18",
    displayDate: formatDisplayDate("2022-03-18"),
    platform: "GX Games",
    imgSrc: "/images/when time collides.webp",
    href: "https://gx.games/games/ef2jjg/when-time-collides/",
    github: "https://github.com/Linkerpink/When-Time-Collides",


    description:
    "When Time Collides is a small retro platformer made for the GameMaker Studio GameJam 2022 where you have to parkour your way through multiple levels while being able to controll time. But what does switching the time do? Are there any enemies? Find out while playing yourself. \n\nDeveloper: \n[Noah van Uunen](https://linkerpink.vercel.app/) \n\nArtists: \n[Luca van Uunen](https://www.youtube.com/@supercatluigiplayer4180/featured) \n[Belle Bunnik](https://www.artstation.com/bellebunnik) \n\n What I made: \n- Player Movement \n- Player Interaction \n- Player Camera \n- Time Switching Mechanic \n- Textbox System \n- Tutorial Dummy with easter eggs \n- Boss Fight",

    technologies: ["/images/gamemaker studio logo.svg"],

    media: [
      { type: "image", src: "/images/when time collides.webp" },
      { type: "image", src: "/images/wtc 1.webp" },
      { type: "image", src: "/images/wtc 2.webp" },
      { type: "image", src: "/images/wtc 3.webp" },
      { type: "youtubeId", src: "kgeYsm6rrzc", title: "The Making Of When Time Collides", },
      { type: "youtubeId", src: "zdwZJZxRDiE", title: "The Making Of When Time Collides", },
    ],

    featured: true,

    codeSnippets: [
{
	name: "PlayerObject: Step",
	language: "GML",
	description: "This is the Step event of the player object. It handles the player movement, time switching and attacking.",
	code: `
    //day and night switching
    timekey = keyboard_check_pressed (ord("C"))// or (gamepad_button_check_pressed(0, gp_face3));
    attackkey = keyboard_check_pressed(ord("X"))
    
    if cancontrol = true
    {
	if timekey and day == true
	{
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		audio_play_sound(TimeChangeSound,3,false);
		ScreenShake(10,20);
		alarm[0] = 20;
        }
	
        if timekey and day == false
        {
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		audio_play_sound(TimeChangeSound,3,false);
		ScreenShake(10,20);
		alarm[1] = 20;
	}
	//attacking
	if attackkey == true
	{
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		alarm[2] = 20;
        }
}


if day == true
{
	grav = 0.4;
	if (cancontrol)
	{
		leftkey = keyboard_check(vk_left)// or (gamepad_button_check(0, gp_padl));
		rightkey = keyboard_check(vk_right)// or (gamepad_button_check(0, gp_padr));
		jumpkey = keyboard_check_pressed (vk_space)// or (gamepad_button_check_pressed(0, gp_face1));

		var move = rightkey - leftkey;

		horispeed = move * walkspeed;
		// left and right movement
		//horizontal collisions
		if (place_meeting(x+horispeed,y,ObstacleObject))
		{
		while (!place_meeting(x+sign(horispeed),y,ObstacleObject))
		{
        x = x + sign(horispeed);
		}
			horispeed = 0;
		}

		x = x + horispeed;

		// jumping
		vertispeed = vertispeed + grav;

		if (place_meeting(x ,y+1,ObstacleObject)) and (jumpkey)
		{
		    vertispeed = -8;
			audio_play_sound(JumpSound,5,false);
		}

		//vertical collisions
		if (place_meeting(x, y+vertispeed,ObstacleObject))
		{
		   while (!place_meeting(x, y+sign(vertispeed), ObstacleObject))
		   {
           y = y + sign(vertispeed);
		   }
		    vertispeed = 0;
		}

		y = y + vertispeed;
        
		// animations :))))))))))))))))))))
        
		image_speed = 1;
		// standing animation
		if (horispeed == 0)
		{
        sprite_index = PlayerSprite;
		}
		// running animation
		else 
		{
			sprite_index = PlayerSpriteRun;
		}
        
		//jumping animation
		if !(place_meeting(x ,y+1,ObstacleObject)) {sprite_index = PlayerSpriteJump;}

		if (horispeed !=0) image_xscale = sign (horispeed);
		image_yscale = 1;
        
		// you are dead not a big suprise
		if hp == 0 
		{
			room_restart();
		}
        
		// damage taken (you nooby gamer)
		invincable = max(invincable-1,0);
	}
	else
	{
		rightkey = 0;
		leftkey = 0;
		jumpkey = 0;
	}
    }

if day == false
{
	grav = 0.1;
	if (cancontrol)
	{
	leftkey = keyboard_check(vk_left)// or (gamepad_button_check(0, gp_padl));
	rightkey = keyboard_check(vk_right)// or (gamepad_button_check(0, gp_padr));
	jumpkey = keyboard_check_pressed (vk_space)// or (gamepad_button_check_pressed(0, gp_face1));
    
	var move = rightkey - leftkey;
    
	horispeed = move * walkspeed;
	// left and right movement
	//horizontal collisions
	if (place_meeting(x+horispeed,y,ObstacleObject))
	{
	while (!place_meeting(x+sign(horispeed),y,ObstacleObject))
	{
    x = x + sign(horispeed);
	}
		horispeed = 0;
	}
    
	x = x + horispeed;
    
	// jumping
	vertispeed = vertispeed - grav;
    
	if (place_meeting(x ,y-8,ObstacleObject)) and (jumpkey)
	{
	    vertispeed = +4;
		audio_play_sound(JumpSound,5,false);
        }

        //vertical collisions
	if (place_meeting(x, y+vertispeed -4,ObstacleObject))
	{
	   while (!place_meeting(x, y+sign(vertispeed), ObstacleObject))
	   {
	    y = y + sign(vertispeed);
	   }
	    vertispeed = 0;
        }
        
        y = y + vertispeed;
        
	// animations :))))))))))))))))))))
    
	image_speed = 1;
	// standing animation
	if (horispeed == 0) 
	{
		sprite_index = PlayerSprite;
	}
	// running animation
	else 
	{
		sprite_index = PlayerSpriteRun;
        }
        
        //jumping animation
        if !(place_meeting(x, y+vertispeed -4,ObstacleObject)) {sprite_index = PlayerSpriteJump;}
        
        if (horispeed !=0) image_xscale = sign (horispeed);
	image_yscale = -1;
    
	// you are dead not a big suprise
	if hp == 0 
	{
		room_restart();
	}
    
	// damage taken (you nooby gamer)
	invincable = max(invincable-1,0);
	}
	else
	{
		rightkey = 0;
		leftkey = 0;
		jumpkey = 0;
        }
        }

        if instance_exists(TextObject) {image_index = PlayerSprite;}
        `
},

{
	name: "CameraObject: Step",
	language: "GML",
	description: "This is the step event of the CameraObject that handles the camera movement, following the player, and screenshake effects.",
	code: `
// cam update
if (instance_exists(follow))
{
	gotoX = follow.x;
	gotoY = follow.y;
}

// object update
x += (gotoX - x) / smooth;
y += (gotoY - y) / smooth;

//keep cam in room else the players see oudside the room that's not what you would want to see in geam
x = clamp(x,w_half_view+buffer,room_width-w_half_view-buffer);
y = clamp(y,h_half_view+buffer,room_height-h_half_view-buffer);

//screenshake
x += random_range(-shake_remain,shake_remain);
y += random_range(-shake_remain,shake_remain);
shake_remain = max(0,shake_remain-((1/shake_length)*shake_strong));

// update camera view
camera_set_view_pos(cam,x-w_half_view,y-h_half_view);

if room = MainGameRoom5
{
	if instance_exists(TextObject)
	{
		smooth = 10;
		follow = BossObjectIntro;
	}
}
if room = MainGameRoom5
{
	if !instance_exists(TextObject)
	{
		smooth = 1;
		follow = PlayerObject;
	}
}
	`
},

{
	name: "TextObject: Draw",
	language: "GML",
	description: "This is the Draw event of the TextObject that displays text on the screen. It handles the textbox, text speed, and page flipping.",
	code: `
accept_key = keyboard_check_pressed(vk_space);

textbox_x = camera_get_view_x(view_camera[0]) +200;
textbox_y = camera_get_view_y(view_camera[0]) +80;

if text_length !=0
{
	PlayerObject.cancontrol = false;
    }
if text_length == 0
{
	PlayerObject.cancontrol = true;
}
//setup
if (setup == false)
{
	setup = true;
	draw_set_font(NormalFont);
	draw_set_valign(fa_top);
	draw_set_halign(fa_left);
	
	//loop trough pages
	for (var p = 0; p < page_number; p++)
	{
		text_length[p] = string_length(text[p]);
		
		//no character talking
		text_x_offset[p] = 44;
		
		//where should the text break? good question
	}
}

//typing the text
if(draw_char < text_length[page])
{
	draw_char += text_speed;
	draw_char = clamp(draw_char, 0, text_length[page]);
}


//flip trough pages
if (accept_key)
{
	//if typing is done
	if (draw_char == text_length[page])
	{
		//next page
		if (page < page_number-1)
		{
			page++;
			draw_char = 0;
		}
		//destroy textbox
		else
		{
			PlayerObject.cancontrol = true;
			instance_destroy();
            }
	}
	//if typing is not done
	else
	{
		draw_char = text_length[page];
	}
}

//draw textbox
txtb_img += txtb_img_speed;
txtb_spr_w = sprite_get_width(txtb_spr);
txtb_spr_h = sprite_get_height(txtb_spr);
//back of textbox
draw_sprite_ext(txtb_spr,txtb_img,textbox_x + text_x_offset[page],textbox_y,textbox_width/txtb_spr_w,textbox_height/txtb_spr_h,0,c_white,1);

//draw the text
var c = 0;
//sfx
//floating text
var _float_y = 0;
if float_text[c, page] == true
{
	float_dir[c, page] += -6;
	_float_y = dsin(float_dir[c, page]);
    }
    
var _drawtext = string_copy(text[page],1,draw_char);
draw_text_ext_color(textbox_x - text_x_offset[page] -70 + border, textbox_y + _float_y + border -70, _drawtext, line_sep, line_width, col_1[c, page], col_2[c, page], col_3[c, page], col_4[c, page], 1);
	`
},

{
	name: "GameTextScript.gml",
	language: "GML",
	description: "This is the script that holds all the dialogue for the game. It is used by the TextObject to display text on the screen when needed.",
	code: `
/// param text_id
function scr_game_text(_text_id) 
{
	switch(_text_id)
	{
		case "sign1":
		scr_text("Press the spacebar on the keyboard to jump.")
		break;
		
		case "sign2":
            scr_text("Press C on the keyboard to change the time.");
            break;
            
            case "sign3":
                scr_text("In the night the gravity is lower. Try to switch between day and night often.");
		break;
		
		case "sign4":
		scr_text("Watch out spikes ahead!");
		break;
		
		case "dummy1":
		scr_text("Hello there. I'm a dummy. You can practice combat on me. Use X on the keyboard to attack.");
		break;
		
		case "dummy2":
            scr_text("I think that's enough practicing for now.");
            break;
		
		case "dummy3":
		scr_text("Uhm please stop it's hurting.");
		break;
		
		case "dummy4":
		scr_text("Please stop.");
		break;
		
		case "dummy5":
            scr_text("STOP!");
		break;
		
		case "dummy6":
		scr_text("IT'S HURTING STOP!");
		break;
		
		case "dummy7":
		scr_text("Ok I think you just don't have feelings for others or something.");
		break;
		
		case "dummy8":
            scr_text("Would you like it if you got hit in the face about 70 times?");
		scr_text("I think not.");
		break;
		
		case "dummy9":
		scr_text("You're starting to annoy me a bit.");
		break;
		
		case "dummy10":
		scr_text("I'm asking you again");
		scr_text("please");
		scr_text("STOP!");
		break;
		
		case "dummy11":
		scr_text("You're starting to annoy me a bit.");
		break;
		
		case "dummy12":
		scr_text("Don't you have anything better to do?");
		break;
		
		case "dummy13":
		scr_text("Wait I have an idea!");
		scr_text("You're annoying me but what if I start to be annoying.");
		break;
		
		case "dummy14":
		scr_text("HAHAHAHAHAHA why are you still not giving up?");
		break;
		
		case "dummy15":
		scr_text("Ok.... It's still not working.");
		scr_text("What if I start to say some random things to annoy you.");
		break;
		
		case "dummy16":
		scr_text("I found the perfect wikihow for you!");
		scr_text("How to be annoying wikihow.");
		break;
		
		case "dummy17":
		scr_text("Do you know SoupDuckVPN?");
		scr_text("It's the best VPN ever!");
		scr_text("Stay safe online and use SoapDuckVPN.");
		break;
		
		case "dummy18":
		scr_text("The funny thing is that SoapDuckVPN doesn't even exist!");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		break;
		
		case "dummy19":
		scr_text("In the beginning god created the heavens and the earth.");
		scr_text("And the earth was waste and void and darkness was apon the face of the deep and the spirit of God moved upon the face of the waters.");
		scr_text("Then god said, let there be light");
		break;
		
		case "dummy20":
		scr_text("..... ... . . .... . .... .... .... ... .....");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		break;
		
		case "dummy21":
		scr_text("Go tauch grass or something.");
		break;
		
		case "boss1":
		scr_text("You....")
		scr_text("You shouldnt have this power")
		scr_text("It's mine, give me that staff!")
		break;
		
		case "signboss":
		scr_text("WARNING! Dangerous area ahead...");
		break;
	}
}
`
},

{
	name: "BossObject",
	language: "GML",
	description: "These are the scripts for the boss fight. The boss has a very simple AI that chooses a random numver every second. if it's 0, it will attack the player with fireballs. If it's another number it will move either up, down, left or right",
	code: `
Create:
bosshp = 100;
boss_hp_max = bosshp;
global.bossdead = false;

healthbar_width = 100;
healthbar_height = 26;
healthbar_x = 120 //(480/2) - (healthbar_width/2);
healthbar_y = CameraObject.y -250;

moving = 0;
alarm[0] = 100;
alarm[1] = 60;
/*
move 0 = attack
move 1 = move right
move 2 = move left
move 3 = move down
move 4 = move up
move 5 = shield
*/
instance_create_layer(PlayerObject.x,PlayerObject.y,layer,MusicObject)

Step:
if moving == 0
{
	sprite_index = BossSprite;
	//alarm 1
}
if moving == 1
{
	sprite_index = BossSprite;
	x ++;
}
if moving == 2
{
	sprite_index = BossSprite;
	x --;
    }
if moving == 3
{
	sprite_index = BossSprite;
	y--;
}
if moving == 4
{
	sprite_index = BossSprite;
	y++;
}
if moving == 5
{
	sprite_index = BossSpriteShield;
}

if bosshp <= 0
{
	global.bossdead = true;
	instance_destroy();
}

Draw GUI:
draw_sprite(HealthBarBackgroundSprite,0,healthbar_x,healthbar_y);
draw_sprite_stretched(HealthBarSprite,0,healthbar_x -2,healthbar_y,(bosshp/boss_hp_max) * healthbar_width +1, healthbar_height);
draw_sprite(HealthBarBorderSprite,0,healthbar_x,healthbar_y);

draw_set_font(NormalFont);
draw_set_halign(fa_left);
draw_set_valign(fa_center);
draw_set_color(c_black);
draw_text(healthbar_x +20, healthbar_y -15,"Boss");

var offset = 2;
draw_set_color(c_white);
draw_text(healthbar_x +20 -offset, healthbar_y -15 -offset,"Boss");

alarm 0:
randomize();
moving = irandom_range(0,4);

alarm[0] = 100;

alarm 1:
if moving == 0 and PlayerObject.day == true
{
	instance_create_layer(x,y,layer,FireballObject);
    }
    alarm[1] = 60;
	`
},

],
},

// Portfolio Website //
{
    title: "Portfolio Website",
    slug: "portfolio-website",
    banner: "/images/portfolio site cover temp.png",
    icon: "/images/portfolio site cover temp.png",
    date: "2025-07-23",
    displayDate: formatDisplayDate("2025-07-23"),
    imgSrc: "/images/portfolio site cover temp.png",
    platform: "Web",

    github: "https://github.com/Linkerpink/linkerpink.github.io",

    description: "This is the website you are currently looking at. It is made with Next.js, TypeScript, and Tailwind CSS. It is a portfolio website that showcases my development projects, skills, and experiences. The site includes some easter eggs, Good luck finding them all :) \n\nThe design of the website is based off the Nintendo Wii U eshop design, Wii U Operating System design and Nintendo Switch eshop design, modified to my own liking. I chose for this type of design because Nintendo has always had great designs for their consoles. The Wii U is my favorite console and defined a big part of my youth and life. \n\nWhat I made: \n- Home Page \n- All Projects Page \n- Project Details Page \n- Re usable Project component \n- Re usable Code Snippet component \n- Theme Support \n- Responsive design \n- Animations \n- Easter Eggs",

    technologies: [
      "/next.svg",
      "/images/typescript logo.svg",
      "/images/tailwind css logo.svg",
    ],

    media: [{ type: "image", src: "/images/portfolio site cover temp.png" }],
    
    featured: true,
    
    codeSnippets: [
      {
        name: "insane script",
        language: "tsx",
        description: "ik was beter.",
        code: `insane code`,
    },
],
},

// Shy //
{
    title: "Shy",
    slug: "shy",
    banner: "/images/Shy Render No Bullshit Ai _Art_ Banner.webp",
    icon: "/images/Shy Render No Bullshit Ai _Art_.webp",
    date: "2024-05-26",
    displayDate: formatDisplayDate("2024-05-26"),
    href: "https://linkerpink.itch.io/shy/",
    github: "https://github.com/GLU-CSD/shy-Linkerpink",
    imgSrc: "/images/Shy Render No Bullshit Ai _Art_.webp",
    platform: "Itch.io",
    
    description: "Shy is a stealth game where you need to get keys and try to escape while not getting cought by the guards. Press B to emote. \n\nWhat I made: \n- Emote wheel. \n- Freelook Camera \n- GameManager \n- Audio System \n- Player \n- Guards \n- Keys & Doors",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
        { type: "image", src: "/images/Shy Render No Bullshit Ai _Art_.webp" },
        { type: "image", src: "/images/shy 1.jpeg" },
        { type: "image", src: "/images/shy 2.jpeg" },
        { type: "image", src: "/images/shy 3.jpeg" },
        { type: "youtubeId", src: "CIiFTZ8dqag", title: "Gameplay Video" },
    ],

    featured: false,

    codeSnippets: [
        {
	name: "EmoteWheel.cs",
	language: "C#",
	description: "This is the script that handles the emote wheel. Most of it is made in unity's canvas.",
	code: `
void Update()
{
	if (Input.GetKeyDown(KeyCode.B))
	{
		ChangeEnableEmoteWheel();
	}

	if (enableEmoteWheel)
	{
		//GetComponent<CanvasGroup>().alpha = 1f;
		wheel.transform.localScale = Vector3.Lerp(wheel.transform.localScale, Vector3.one, 0.05f);
		gameManager.ChangeCamera(gameManager.freeLookCam, gameManager.playerCam);

		//animator.SetBool("animateIn", false);
	}
	else
        {
		//GetComponent<CanvasGroup>().alpha = 0f;
		wheel.transform.localScale = Vector3.zero;

		//animator.SetBool("animateIn", false);
	}
}

public void ChangeEnableEmoteWheel()
{
	if (canChangeEmoteWheel)
	{
		if (!gameManager.gamePaused)
		{
			enableEmoteWheel = !enableEmoteWheel;

			if (enableEmoteWheel)
			{
				player.canMove = false;
			}else
			{
				player.canMove = true;
			}
		}
	}   
}
	`
},

{
	name: "Emote.cs",
	language: "C#",
	description: "This is the script for making the player emote when they have selected an emote from the wheel, and then changes the camera acordingly",
	code: `
    public void EmoteDab()
    {
	if (emoteWheel.enableEmoteWheel)
	{
    if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(1f, emoteCam));

			animator.SetTrigger("emoteDab");
			audioManager.Play("Dab");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteFlippinSexy()
{
	if (emoteWheel.enableEmoteWheel)
	{
    if (!isEmoting) 
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(3f, emoteCam));

			animator.SetTrigger("emoteFlippinSexy");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
    }
    
    public void EmoteDance()
    {
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(2f, emoteCam));

			animator.SetTrigger("emoteDance");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
        }
}

public void EmoteSalute()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
        emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(1f, emoteCam));

			animator.SetTrigger("emoteSalute");
            
			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
    }

public void EmoteDefaultDance()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(5f, emoteCam));

			animator.SetTrigger("emoteDefaultDance");

			audioManager.Play("Default Dance");

			gameManager.ChangeCamera(playerCam, emoteCam);
            }
            }
            }

public void EmoteGriddy()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			//StartCoroutine(EmoteTimer(7f, emoteCam));

			animator.SetTrigger("emoteGriddy");

			audioManager.Play("Griddy");

			//gameManager.ChangeCamera(playerCam, emoteCam);
            }
	}
}

public void EmoteSus()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			animator.SetTrigger("emoteSus");
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(10f, emoteCamSus));

			gameManager.ChangeCamera(playerCam, emoteCamSus);
		}
	}
}

private IEnumerator EmoteTimer(float time, CinemachineVirtualCamera cam)
{
	//Make sure the cam variable is the same as the cam you change it to
	isEmoting = true;
	emoteWheel.player.canMove = false;
	yield return new WaitForSeconds(time);
	isEmoting = false;
	emoteWheel.player.canMove = true;
    
	gameManager.ChangeCamera(cam, playerCam);
    }
	`
},

{
    name: "GameManager.cs",
	language: "C#",
	description: "This is the GameManager script that handles the pausing of the game, camera switching, level completion and cheats",
	code: `
private void Update()
{
	if (Input.GetButtonDown("Pause"))
	{
    gamePaused = !gamePaused;
	}
    
	if (gamePaused)
	{
    Time.timeScale = 0.0f;
    pauseUi.enabled = true;
    
		if (Input.GetKeyDown(KeyCode.Return))
		{
        enableCheatInput = !enableCheatInput;
		}
        
		if (enableCheatInput)
		{
			cheatInput.SetActive(true);
		}
		else
            {
			cheatInput.SetActive(false);
		}
	}
	else
        {
		Time.timeScale = 1.0f;
		pauseUi.enabled = false;
		enableCheatInput = false;
	}

	if (levelCompleted)
	{
    StartCoroutine(LevelCompleted());
	}
}

public void ChangeCamera(CinemachineVirtualCamera oldCam, CinemachineVirtualCamera cam)
{
	oldCam.Priority = 0;
	cam.Priority = 10;
}

public void CheckInput(string s)
{

	input = cheatInput.GetComponent<TMP_InputField>().text;
	Debug.Log(input);
	if (input == "enable cheats")
	{
		enableCheats = true;
		Debug.Log("Cheats enabled");
	}

	if (input == "disable cheats")
	{
		enableCheats = false;
		Debug.Log("Cheats disabled");
	}
}

public IEnumerator LevelCompleted()
{
	winText.SetActive(true);
	yield return new WaitForSeconds(5f);
	SceneManager.LoadScene("Main Menu");
	levelCompleted = false;
    }
	`
},

{
	name: "AudioManager.cs",
	language: "C#",
	description: "This is a simple AudioManager for playing sounds in the game. The sounds array should be set in the unity editor and should contain every audio in the game with the correct naming.",
	code: `
public Sound[] sounds;

private void Awake()
{
	foreach(Sound s in sounds)
	{
		s.source = gameObject.AddComponent<AudioSource>();
		s.source.clip = s.clip;

		s.source.volume = s.volume;
		s.source.pitch = s.pitch;
		s.source.loop = s.loop;
	}
    
	Play("Music");
    }

public void Play(string name)
{
	Sound s = Array.Find(sounds, sound => sound.name == name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.Play();
}
	`
},

{
	name: "PlayerMovement.cs",
	language: "C#",
	description: "This is the script for the player. It works with the Unity NavMesh and moves to a point set when clicked on the screen.",
	code: `
private void Update()
{
	cam = GameObject.Find("Main Camera").GetComponent<Camera>();

	if (Input.GetMouseButtonDown(0))
	{
		Ray ray = cam.ScreenPointToRay(Input.mousePosition);
		RaycastHit hit;
        
		if (Physics.Raycast(ray, out hit))
		{
        NavMeshHit navHit;
        if (NavMesh.SamplePosition(hit.point, out navHit, 1.0f, NavMesh.AllAreas))
        {
        agent.SetDestination(navHit.position);
			}
            }
	}

	agentSpeed = agent.velocity.magnitude;

	animator.SetFloat("Walking", agentSpeed);

	animator.SetFloat("sleepTimer", sleepTimer);

	if (!canMove)
	{
    agent.velocity = Vector3.zero;
		agentSpeed = 0;
	}else
	{
		if (agentSpeed > 0.1)
		{
			sleepTimer = 0;
		}
		else
		{
			sleepTimer += Time.deltaTime;
		}
	}

    }

private IEnumerator Die()
{
	//Level failed
	died = true;
	canMove = false;
	emoteWheel.enableEmoteWheel = false;
	emoteWheel.canChangeEmoteWheel = false;
	dieText.enabled = true;
	animator.SetTrigger("Died");
	audioManager.Play("Gasp");

	yield return new WaitForSeconds(5f);
	SceneManager.LoadScene("Main Menu");
    }

private void OnTriggerEnter(Collider other)
{
	if (other.gameObject.tag == "Enemy" && !died && !gameManager.levelCompleted)
	{
		StartCoroutine(Die());
        }
}

private void OnTriggerStay(Collider other)
{
	if (other.gameObject.tag == "Exit")
	{
		if (gameManager.doorsOpened >= 2 & !gameManager.levelCompleted)
		{
			//Level complete
			gameManager.levelCompleted = true;
			
			animator.SetTrigger("levelCompleted");
			canMove = false;
			emoteWheel.enableEmoteWheel = false;
			emoteWheel.canChangeEmoteWheel = false;
		}
	}
}
	`
},

{
	name: "Enemy.cs",
	language: "C#",
	description: "This is the script for the enemy. It also uses the Unity Navmesh. When not seeing the player, it will patrol around. When the enemy is patroling, it will choose a random point in a certain range and move to that. When it sees the player, it will chase it when in a certain range.",
	code: `
private void Update()
{
	//Check for sight and attack range
	playerInSightRange = Physics.CheckSphere(transform.position, sightRange, whatIsPlayer);

	if (!playerInSightRange)
	{
		Patroling();
	}

	if (playerInSightRange)
	{
		ChasePlayer();
        }
        
        if (player.died) 
        {
		agent.speed = 0;
		animator.SetTrigger("Outrage");
		transform.Rotate(playerTransform.position);
        }
}

private void Patroling()
{
	if (!walkPointSet)
	{
		SearchWalkPoint();
	}

	if (walkPointSet)
	{
		agent.SetDestination(walkPoint);
	}

	Vector3 distanceToWalkPoint = transform.position - walkPoint;

	//Walkpoint reached
	if (distanceToWalkPoint.magnitude < 1f)
	{
		walkPointSet = false;
	}
}

private void SearchWalkPoint()
{
	//Calculate random point in range
	float randomZ = Random.Range(-walkPointRange, walkPointRange);
	float randomX = Random.Range(-walkPointRange, walkPointRange);

	walkPoint = new Vector3(transform.position.x + randomX, transform.position.y, transform.position.z + randomZ);

	if (Physics.Raycast(walkPoint, -transform.up, 2f, whatIsGround))
	{
		walkPointSet = true;
	}
}

private void ChasePlayer()
{
	agent.SetDestination(playerTransform.position);
    }
	`
},

],
},

// Risk It For The Biscuit //
// {
//   title: "Risk It For The Biscuit",
//   slug: "risk-it-for-the-biscuit",
//   banner: "/images/eng.png",
//   icon: "/images/eng.png",
//   date: "not released",
//   displayDate: formatDisplayDate("not released"),
//   platform: "Itch.io",
//   description:
//   "",
  
//   href: "",
//   github: "https://github.com/Linkerpink/Risk-It-For-The-Biscuit",
  
//   technologies: ["/images/godot logo.svg", "/images/gdscript logo.webp"],
  
//   media: [
//     { type: "image", src: "/images/eng.png" },
//   ],

//   featured: false,

//   codeSnippets: [
      
//   ]
// },
  
// Open Pixel Art //
  {
    title: "Open Pixel Art",
    slug: "open-pixel-art",
    banner: "/images/open pixel art temp logo.png",
    icon: "/images/open pixel art temp logo.png",
    
    date: "not released",
    displayDate: formatDisplayDate("not released"),

    href: "",
    github: "https://github.com/Linkerpink/Open-Pixel-Art",

    imgSrc: "/images/open pixel art temp logo.png",
    platform: "Itch.io",

    description:
      "A free & open source pixel art tool, made with mobile in mind. \n\nThis tool was designed for my brother (Luca / SupercatLuigi Player) , who is my main artist for full release games that we want to develop. I don't want to show them on my portfolio yet. He likes working on touch devices instead of on pc, and we couldn't find a pixel art app that suited both our needs. So I made one myself.",

    technologies: [
        "/images/godot logo.svg",
        "/images/gdscript logo.webp"
    ],

    media: [
      { type: "image", src: "/images/open pixel art temp logo.png" },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "fire script",
        language: "GDScript",
        description: "ik ben beter.",
        code: `insane code`,
      },
    ],
},

  // Slimetastic Punchout //
  {
    title: "Slimetastic Punchout",
    slug: "slimetastic-punchout",
    banner: "/images/slimetastic punchout cover art.png",
    icon: "/images/slimetastic punchout cover art.png",

    date: "2024-12-5",
    displayDate: formatDisplayDate("2024-12-5"),

    href: "https://nielscraft12.itch.io/slimetastic-punchout",
    github: "https://github.com/GLU-CSD/shy-Linkerpink",

    imgSrc: "/images/slimetastic punchout cover art.png",
    platform: "Itch.io",

    description:
      "Slimetastic Punchout is a chaotic and fun local multiplayer game where you take control of colorful, squishy slimes and battle it out in fast-paced arenas. The goal? Cover as many tiles as you can while sliding, bouncing, and splattering your way across the map. Along the way, you can land some solid punches to shove your opponents out of the way—or just throw them off their game. Every match is unpredictable, full of laughter, and a messy fight for control. It’s slimy chaos at its best! \n\nDevelopers: \n[Niels de Laat](https://nielsdelaat.com) \n[Noah van Uunen](https://linkerpink.vercel.app/) \n\nArtists: \n[Seemay Alsemgeest](https://www.artstation.com/seemz) \n[Jordy Andriessen](https://www.artstation.com/sekerio) \n[Lisa van der Kloet](https://www.artstation.com/lisavdkloet) \n\nWhat I made: \n- Player Attacking \n- Win Calculation \n- Unused Dynamic Camera \n\nThis project was made at one of my lowest points mentally. I had a lot of personal issues and didn't have motivation on anything at that moment. I thought about not including it in the: all projects section, but that would be a bit against what I was trying to acomplish with that section of the site. I want all projects I made and are sort of showcasable to be shown here. So don't expect the best from this game. Niels carried",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/slimetastic punchout cover art.png" },
      { type: "image", src: "/images/sp 2.png" },
      { type: "image", src: "/images/sp 3.png" },
      { type: "youtubeId", src: "zgEdaaWe3JQ", title: "Launch Trailer" },
    ],

    featured: false,

    codeSnippets: [
{
	name: "GameManager.cs",
	language: "C#",
	description: "Calculate win function: Gets all the tiles in the map. All the tiles hold a variable for which player touched it last. Then there is a List of sorted scores and calculates the wins from there.",
	code: `
private void CalculateWin()
{
	canCalculate = false;
	isPerformingWin = true;

	GameObject _stageScene = GameObject.Find("Stage Scene");
	Tile[] tiles = GameObject.FindObjectsOfType<Tile>();

	// Update player scores
	for (int i = 0; i < tiles.Length; i++)
	{
		if (tiles[i].GetComponent<Tile>().lastPlayer >= 0)
		{
			playerScore[tiles[i].GetComponent<Tile>().lastPlayer] += 1;
		}
	}

	// Convert playerScore to a List and sort in descending order
	List<int> sortedScores = new List<int>(playerScore);
	sortedScores.Sort((a, b) => b.CompareTo(a));  // Sort in descending order

	// Create a list to hold player indices in sorted order
	List<int> sortedPlayerIndices = new List<int>();
	foreach (int score in sortedScores)
	{
		for (int i = 0; i < playerScore.Length; i++)
		{
			if (playerScore[i] == score && !sortedPlayerIndices.Contains(i))
			{
				sortedPlayerIndices.Add(i);
				break;
			}
		}
	}

	// Set winner (1st place)
	int _winner = sortedPlayerIndices[0];
	GameObject _winnerObject = playerArray[_winner].gameObject;
	TileColorChanger _winnerTileColorChanger = _winnerObject.GetComponent<TileColorChanger>();

	// Win text
	timerText.SetText("Player " + (_winner + 1).ToString() + " won");
	timerText.color = _winnerTileColorChanger.colors[_winnerTileColorChanger.colorSelected];
	timerText.alpha = 255;
	timerText.outlineColor = Color.black;
	timerText.outlineWidth = 0.25f;

	// Animations for winner
	// Animator _winnerAnimator = _winnerObject.GetComponentInChildren<Animator>();
	// _winnerAnimator.SetInteger("RandomWinAnimation", Random.Range(1, 2));

	// Set the winner's position (1st place)
	foreach (Transform _child in _stageScene.transform)
	{
		if (_child.name == "1st Player Position")
		{
			_winnerObject.transform.position = _child.transform.position;
		}
	}

	// Set positions for 2nd, 3rd, and 4th place players
	for (int i = 1; i < sortedPlayerIndices.Count && i < 4; i++)
	{
		int playerIndex = sortedPlayerIndices[i];
		GameObject playerObject = playerArray[playerIndex].gameObject;

		// Find the position name based on the place (2nd, 3rd, 4th)
		string positionName = $"{(i + 1)}{GetSuffix(i + 1)} Player Position";
		foreach (Transform _child in _stageScene.transform)
		{
			if (_child.name == positionName)
			{
				playerObject.transform.position = _child.transform.position;
			}
		}
	}
	Stage.SetActive(true);
	cameraManager.ChangeCamera(cameraManager.mainCam, cameraManager.winCam);
}

// Helper function to get the suffix for position numbers (1st, 2nd, 3rd, 4th)
private string GetSuffix(int number)
{
	if (number == 1) return "st";
	else if (number == 2) return "nd";
	else if (number == 3) return "rd";
	else return "th";
}
	`
},

{
	name: "PlayerAttack.cs",
	language: "C#",
	description: "The player attack works by shooting a raycast and checking if it hit another player. If it did then it gives knockback to that player. It also has a cooldown so you can't spam it.",
	code: `
private void Update()
{
	if (!gameManager.isPerformingWin)
	{
		// Handle cooldown for punches
		if (cooldown > 0)
		{
			cooldown -= Time.deltaTime;
		}

		if (punchDamageCooldown > 0)
		{
			punchDamageCooldown -= Time.deltaTime;

			RaycastHit hit;

			if (Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), out hit, punchLength))
			{
				if (hit.transform.gameObject.CompareTag("Player"))
				{
					raycastHit = hit;
					raycastHit.transform.gameObject.GetComponent<PlayerAttack>().HitKnockback(knockbackDuration, hitDirection);
				}
			}
		}

		// Modified knockback handling
		if (knockbackTimer > 0)
		{
			knockbackTimer -= Time.deltaTime;
			if (knockbackTimer <= 0)
			{
				rb.velocity = Vector3.zero; // Stop knockback when timer ends
			}
		}
	}
}

public void OnPunch(InputAction.CallbackContext _context) // The punch input
{
	if (_context.performed && cooldown <= 0)
	{
		animator.SetTrigger("Punch");
		cooldown = cooldownValue;
		punchDamageCooldown = punchDamageCooldownValue;
		hitDirection = transform.forward; // Use actual forward direction instead of lastMoveDirection
	}
}

public void HitKnockback(float _knockbackDuration, Vector3 _hitDirection)
{
	if (knockbackTimer <= 0)
	{
		knockbackTimer = _knockbackDuration;
		rb.velocity = Vector3.zero;
		rb.AddForce(_hitDirection * knockbackStrength, ForceMode.Impulse);
		playerController.SetKnockback(true);

		// Start a coroutine to reset knockback state
		StartCoroutine(ResetKnockback(_knockbackDuration));
	}
}

private IEnumerator ResetKnockback(float duration)
{
	yield return new WaitForSeconds(duration);
	playerController.SetKnockback(false);
}
	`
},

{
	name: "CameraFollow.cs",
	language: "C#",
	description: "Dynamic camera system that gets closer or further away depending on where the players are at that moment. We didn't use it in the game, because there was a bug where sometimes it just didn't want to calculate the top. I didn't have the time and especially motivation at the time to fix it.",
	code: `
private void Update()
{
	players = gameManager.playerArray;

	if (players.Length == 0)
	{
		return;
	}

	MoveCam();
	ZoomCam();
}

private void MoveCam()
{
	Vector3 centerPoint = GetCenterPoint();

	Vector3 newPosition = centerPoint + offset;

	transform.position = Vector3.SmoothDamp(transform.position, newPosition, ref velocity, smoothTime);
}

private void ZoomCam()
{
	float newZoom = Mathf.Lerp(minZoom, maxZoom, GetGreatestDistance() / zoomLimiter);
	cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, newZoom, Time.deltaTime);
}

private float GetGreatestDistance()
{
	var _bounds = new Bounds(players[0].transform.position, Vector3.zero);

	for (int i = 0; i < players.Length; i++)
	{
		_bounds.Encapsulate(players[i].transform.position);
	}

	return _bounds.size.x;
}

//This function is based of the brackeys tutorial: "MULTIPLE TARGET CAMERA in Unity"
private Vector3 GetCenterPoint()
{
	if (players.Length == 1)
	{
		return players[0].transform.position;
	}

	var _bounds = new Bounds(players[0].transform.position, Vector3.zero);

	for (int i = 0; i < players.Length; i++)
	{
		_bounds.Encapsulate(players[i].transform.position);
	}

	return _bounds.center;
}
	`
},
    ],
},

// SHMUP 2 (traumatic flashbacks) //
{
  title: "SHMUP 2",
  slug: "shmup-2",
  banner: "/images/shmup 2 banner.webp",
  icon: "/images/shmup 2 icon.webp",

  date: "2024-10-10",
  displayDate: formatDisplayDate("2024-10-10"),

  href: "https://linkeralt.itch.io/shmup-2/",
  github: "https://github.com/Linkerpink/shmup-2",

  imgSrc: "/images/shmup 2.webp",
  platform: "itch.io",

  description:
    "A simple wave based Shoot Em Up Game. \n\nScratch version: \nhttps://scratch.mit.edu/projects/1076756881/ \n\nWhat I made: \n- Wave System \n- Player \n- Pickups \n- Infinitely scrolling background \n- Scratch version",

  technologies: [
    "/images/unity logo.png",
    "/images/c sharp logo.svg",
    "/images/scratch logo.png",
  ],

  media: [
        { type: "image", src: "/images/shmup 2.webp" },
        { type: "image", src: "/images/shmup 2 1.jpeg" },
        { type: "image", src: "/images/shmup 2 5.jpeg" },
        { type: "image", src: "/images/shmup 2 3.jpeg" },
        { type: "image", src: "/images/shmup 2 4.jpeg" },
        { type: "image", src: "/images/shmup 2 7.jpeg" },
        { type: "youtubeId", src: "4wd0sW7k4PU", title: "Gameplay Video" },
        { type: "youtubeId", src: "NJa-z-04Vqc", title: "Scratch Edition Gameplay Video" },
    ],

  featured: false,

  codeSnippets: [
{
	name: "WaveManager.cs",
	language: "C#",
	description: "This is the WaveManager script. It sets an initial spawnDelay between enemies spawned in a way and then starts a new wave once every enemy in a wave has been defeated. It also spawns a health pickup every time a new wave starts",
	code: `
private void Update()
{
	waveText.SetText("WAVE: " + wave);
	spawnDelay = initialSpawnDelay - (wave / 25);

	if (enemies.Count <= 0)
	{
		NewWave();
	}
}

private void NewWave()
{
	wave += 1;

	healthPickupPos = new Vector2(Random.Range(0f, 8.8f), player.transform.position.y);

	Instantiate(healthPickup, healthPickupPos, Quaternion.identity);

	StartCoroutine(SpawnEnemies());
}

private IEnumerator SpawnEnemies()
{
	for (int i = 0; i < wave; i++)
	{
		GameObject _enemy = Instantiate(enemyTypes[Random.Range(0, enemyTypes.Count)], enemySpawn);
		enemies.Add(_enemy);
		yield return new WaitForSeconds(spawnDelay);
	}
}

public void RemoveEnemy(GameObject _enemy)
{
	enemies.Remove(_enemy);
	Destroy(_enemy);
}
	`
},

{
	name: "Scroll.cs",
	language: "C#",
	description: "This handles the background scrolling. The background is split into 3 parts in Unity, so it doesn't feel snappy when it resets to the top.",
	code: `
void Update()
{
	this.transform.position += Vector3.down * moveSpeed * Time.deltaTime;

	if (this.transform.position.y + offset < secondCam.ScreenToWorldPoint(Vector2.right * (float)Screen.width).y)
	{
		this.transform.position = Vector2.up * 20;
	}
}
	`
},

{
	name: "PlayerMovement.cs",
	language: "C#",
	description: "This handles the movement of the Player character.",
	code: `
private void Awake()
{
	gameManager = GameObject.Find("Game Manager").GetComponent<GameManager>();

	controls = new Controls();

	controls.Player.Movement.performed += context => Movement(context.ReadValue<Vector2>());
	controls.Player.Movement.canceled += context => Movement(context.ReadValue<Vector2>());

	rb = GetComponent<Rigidbody2D>();
	spriteRenderer = GetComponentInChildren<SpriteRenderer>();
}

private void OnEnable()
{
	controls.Enable();
}

private void OnDisable()
{
	controls.Disable();
}

private void FixedUpdate()
{
	if (canMove) 
	{
		rb.linearVelocity = moveDirection * moveSpeed;
	}else
	{
		rb.linearVelocity = Vector2.zero;
	}

	//transform.eulerAngles = Vector3.Lerp(transform.eulerAngles, new Vector3(0, 0, moveDirection.x * -rotationMultiplier), rotationSpeed);
}

private void Movement(Vector2 _direction)
{
	moveDirection = new Vector2(_direction.x, 0f);
}

public IEnumerator Freeze(float _freezeTime)
{ 
	canMove = false;
	spriteRenderer.color = Color.blue;
	yield return new WaitForSeconds(_freezeTime);
	spriteRenderer.color = Color.white;
	canMove = true;
}

//Input
public void OnDeviceChange(PlayerInput _input)
{
	isGamepad = _input.currentControlScheme.Equals("Gamepad") ? true : false;
}
}
	`
},

{
	name: "PlayerHealth.cs",
	language: "C#",
	description: "This handles the Player Health. The icons are in an array and they get shown or hidden depending on how much health the player has. It also contains the flashing and invincibility functions that are timer based.",
	code: `
private void Update()
{
	foreach (GameObject healthIcon in healthIcons)
	{
		healthIcon.SetActive(false);

		for (int i = 0; i < hp; i++)
		{
			healthIcons[i].SetActive(true);
		}
	}

	if (hp <= 0)
	{
		Die();
	}

	//Player flashing
	if (invincible)
	{
		spriteRendererTimer -= 1f * Time.deltaTime * 10;

		if (spriteRendererTimer <= 0)
		{
			enableSpriteRenderer = !enableSpriteRenderer;
			spriteRendererTimer = 1f;
		}

		if (enableSpriteRenderer == true)
		{
			spriteRenderer.enabled = true;
		}
		else
		{
			spriteRenderer.enabled = false;
		}
	}
	else
	{
		spriteRenderer.enabled = true;
	}
}

private void OnTriggerEnter2D(Collider2D collision)
{
	if (!invincible)
	{
		if (collision.gameObject.tag == "Enemy Bullet")
		{
			hp--;
			StartCoroutine(Invincible(1f));
		}

		if (collision.gameObject.tag == "Freeze Bullet")
		{
			hp--;
			StartCoroutine(movement.Freeze(1));
			StartCoroutine(Invincible(1f));
		}

		if (collision.gameObject.tag == "Health Pickup")
		{
			if (hp < 3)
			{
				hp++;
			}

			Destroy(collision.gameObject);
		}
	}
}

public IEnumerator Invincible(float _iSeconds)
{
	invincible = true;
	yield return new WaitForSeconds(1f);
	invincible = false;
}

private void Die()
{
	SceneManager.LoadScene("Death Screen");
}
}
	`
},


],
},

// // Not Grow A Garden //
// {
//   title: "Not Grow A Garden",
//   slug: "not-grow-a-garden",
//   banner: "/images/not grow a garden temp logo.png",
//   icon: "/images/not grow a garden temp logo.png",

//   date: "not released",
//   displayDate: formatDisplayDate("not released"),

//   href: "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",
//   github:
//     "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",

//   imgSrc: "/images/not grow a garden temp logo.png",
//   platform: "Itch.io",

//   description: "anti horror \n\n Developers: \nLinkerpink\nMathijn Wismeijer",

//   technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

//   media: [{ type: "image", src: "/images/not grow a garden temp logo.png" }],

//   featured: false,

//   codeSnippets: [
//     {
//       name: "PlayerMovement.cs",
//       language: "C#",
//       description:
//         "the player movement for the mobile game: not grow a garden (we haven't thought of a good name yet)",
//       code: `using UnityEngine;
// using UnityEngine.InputSystem;
// using UnityEngine.Serialization;
// using UnityEngine.UI;

// public class PlayerMovement : MonoBehaviour
// {
//   #region Variabelen

//   public Transform cameraTransformatie;
  
//   [Header("Snelheden")]
//   [SerializeField] private float bewegingsSnelheid;
  
//   [Header("Hoeken")]
//   private float m_hoek;
//   private float m_doelHoek;
//   private float m_laatsteHoek;
  
//   [Header("Directies")]
//   private Vector2 m_invoerDirectie;
//   private Vector3 m_bewegingsDirectie;
  
//   [Header("Soepel Bewegen")]
//   [SerializeField] private float m_soepeleTijdDraaien = 0.1f;
//   private float m_draaiSoepeleSnelheid;
  
//   [Header("Componenten")]
//   private Rigidbody m_stijfLichaam;
//   private BlijheidStok m_blijheidStok;

//   public bool magBewegen = true;
  
//   private float deltaTijd = 0.0f; // Nodig voor anti insect kader snelheid text

//   #endregion

//   private void WakkerWorden()
//   {
//       m_stijfLichaam = GetComponent<Rigidbody>();
//       m_blijheidStok = FindAnyObjectByType<BlijheidStok>();
//   }
  
//   private void Bijwerken()
//   {
//       // Krijg invoerdirectie van de blijheidStok
//       m_invoerDirectie = m_blijheidStok.KrijgInvoer();
      
//       deltaTijd += (Time.deltaTime - deltaTijd) * 0.1f;
//   }

//   private void VastBijwerken()
//   {
//       if (m_invoerDirectie.sqrMagnitude > 0.01f && magBewegen) 
//       {
//           m_bewegingsDirectie = new Vector3(m_invoerDirectie.x, 0, m_invoerDirectie.y);
//           m_doelHoek = Mathf.Atan2(m_bewegingsDirectie.x, m_bewegingsDirectie.z) * Mathf.Rad2Deg + cameraTransformatie.eulerAngles.y;
//           m_hoek = Mathf.SmoothDampAngle(transform.eulerAngles.y, m_doelHoek, ref m_draaiSoepeleSnelheid, m_soepeleTijdDraaien);
//           m_laatsteHoek = m_hoek;
//       }
//       else
//       {
//           m_bewegingsDirectie = Vector3.zero;
//           m_hoek = m_laatsteHoek;
//       }

//       if (magBewegen)
//       {
//           m_stijfLichaam.linearVelocity = m_bewegingsDirectie * bewegingsSnelheid;
//       }
      
//       transform.rotation = Quaternion.Euler(0f, m_hoek, 0f);
//   }
  
//   private void OnGUI()
//   {
//       if (SpelBeheerder.Instance.antiInsectInschakelen)
//       {
//           int w = Screen.width, h = Screen.height;
//           GUIStyle style = new GUIStyle();

//           Rect rect = new Rect(10, 100, w, h * 2 / 100);
//           style.alignment = TextAnchor.UpperLeft;
//           style.fontSize = h * 2 / 50;
//           style.normal.textColor = Color.white;

//           float fps = 1.0f / deltaTijd;
//           string text = string.Format("{0:0.} fps", fps);
//           GUI.Label(rect, text, style);    
//       }
//   }
  
//   #region Neppe Functies
  
//   private void Awake()
//   {
//       WakkerWorden();
//   }
  
//   private void Update()
//   {
//       Bijwerken();
//   }

//   private void FixedUpdate()
//   {
//       VastBijwerken();
//   }

//   #endregion
// }`,
//     },
//   ],
// },

  // Fnaf Unity Fortnite Official Game Godot //
  {
    title: "Fnaf Unity Fortnite Official Game Godot",
    slug: "fnaf-unity-fortnite-official-game-godot",
    banner: "/images/fnaf unity fortnite official game godot.webp",
    icon: "/images/fnaf unity fortnite official game godot.webp",

    date: "not released",
    displayDate: formatDisplayDate("not released"),

    href: "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",
    github:
      "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",

    imgSrc: "/images/fnaf unity fortnite official game godot.webp",
    platform: "Itch.io",

    description:
      "horror \n\n Developers: \n[Noah van Uunen](https://linkerpink.vercel.app/)\n[Jesse Faassen](https://sites.google.com/view/jesse-faassen/home?authuser=0) \n\nArtists: \n[Noah van Uunen](https://linkerpink.vercel.app/) \n[Jesse Faassen](https://sites.google.com/view/jesse-faassen/home?authuser=0)",

    technologies: [
      "/images/fnaf unity fortnite official game godot.webp",
      "/images/unity logo.png",
      "/images/fortnite.webp",
      "/images/official.webp",
      "/images/game.jpg",
      "/images/godot logo.svg",
    ],

    media: [
      {
        type: "image",
        src: "/images/fnaf unity fortnite official game godot.webp",
      },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik ben LETTERLIJK beter.",
        code: `horror code`,
      },
    ],
  },
  
  // Bug Exterminator (half a spider in 3 weeks!!! jeremy mode and maxwell mode make me not wanna cry) //
  {
      title: "Bug Exterminator",
      slug: "bug-xterminator",
      banner: "/images/bug 4.png",
      icon: "/images/bug 4.png",
      
      date: "2024-4-4",
      displayDate: formatDisplayDate("2024-4-4"),
      
      href: "https://rileytimmerman.itch.io/bug-exterminator",
      github: "https://github.com/Linkerpink/Poker-Roguelike",
      
      imgSrc: "/images/shmup.webp",
      platform: "itch.io",
      
      description:
      "Bug Exterminator is an indie SHMUP where you shoot mutant insects and help clean up a destroyed world. As a robot frog you fly through the land and defeat all the insects that stand in your way, but there's a menacing monster at the end, can you defeat it? \n\nThis game was created by a team of first year students (4 Game Artists, 2 Creative Software Developers) in under 3 weeks. \n\nWhat I made: \n- Cheat menu \n- Jeremy Mode (cheat) \n- Maxwell Mode (cheat) \n- Level progress bar \n- Player movement \n- Player health / health regen",
      
      technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],
      
      media: [
          { type: "image", src: "/images/bug 1.png" },
          { type: "image", src: "/images/bug 2.png" },
          { type: "image", src: "/images/bug 3.png" },
          { type: "image", src: "/images/shmup.webp" },
          { type: "image", src: "/images/bug 4.png" },
          { type: "image", src: "/images/bug 5.png" },
          { type: "youtubeId", src: "VBLMkvfqAlw", title: "Launch Trailer" },
        ],
        
        featured: false,
        
        codeSnippets: [

{
	name: "Player.cs",
	language: "C#",
	description: "This is the Player Script.",
	code: `
void Update()
{
	Timers();

	Movement();

	Attacking();

	HP();

	if (gameManager.maxwellMode == true)
	{
		maxwellVisuals.SetActive(true);
		frogVisuals.SetActive(false);
	}
	else
	{
		maxwellVisuals.SetActive(false);
		frogVisuals.SetActive(true);
	}

	if (enemiesKilled >= enemiesForMulti)
	{
		multiShot = true;
	}
	else
	{
		multiShot = false;
	}
}

private void Timers()
{
	if (multiShot == true)
	{

		if (bulletTimer < multiTarget)
		{
			bulletTimer += Time.deltaTime;
		}
	}
	else
	{

		if (bulletTimer < bulletTarget)
		{
			bulletTimer += Time.deltaTime;
		}
	}

	if (attackTimer < attackTarget)
	{
		attackTimer += Time.deltaTime;
	}

	//Health Re-gen Timer
	if (hpRegenTimer < hpRegenTarget)
	{
		hpRegenTimer += Time.deltaTime;
	}

	if (hpRegenTimer >= hpRegenTarget)
	{
		if (addHpTimer < addHpTimerTarget)
		{
			addHpTimer += Time.deltaTime;
		}

		if (addHpTimer >= addHpTimerTarget)
		{
			if (hp < 200)
			{
				hp += hpToAdd;
				addHpTimer = 0;
				Instantiate(hpRegenText);
			}
		}
	}
}

private void Movement()
{
	// Movement code
	horizontal = Input.GetAxis("Horizontal");
	vertical = Input.GetAxis("Vertical");

	movement = new Vector3(horizontal * moveSpeed, vertical * moveSpeed, 0f);

	// Apply the movement to the rigidbody
	playerRB.linearVelocity = movement;
}

private void Attacking()
{
	// Attack code
	if (attackTimer >= attackTarget)
	{
		if (Input.GetButton("Fire2"))
		{
			GameObject go = Instantiate(tongue, attackPoint.position, Quaternion.identity);
			Destroy(go, attackDura);
			attackTimer = 0;
			bulletTimer = 0;
		}
	}

	if (multiShot == true)
	{
		if (bulletTimer >= multiTarget)
		{
			if (Input.GetButton("Fire1"))
			{
				for (int i = 0; i < bulletsToShoot; i++)
				{
					float rotatonAmmount = bulletSpread / bulletsToShoot;
					Quaternion target = Quaternion.Euler(-bulletSpread / 2 + (rotatonAmmount * i), 90, 0);
					GameObject go = Instantiate(bullet, attackPoint.position, target);
					Destroy(go, bulletDura);
					bulletTimer = 0;
					attackTimer = attackTarget / 2;
				}
			}
		}
	}
	else
	{
		if (bulletTimer >= bulletTarget)
		{
			if (Input.GetButton("Fire1"))
			{
				Quaternion target = Quaternion.Euler(0, 90, 0);
				GameObject go = Instantiate(bullet, attackPoint.position, target);
				Destroy(go, bulletDura);
				bulletTimer = 0;
				attackTimer = attackTarget / 2;
			}
		}
	}
}

private void HP()
{
	// HP code
	hpText.SetText("HP: " + hp.ToString());

	if (hp <= 0)
	{
		KillPlayer();
	}
}

private void KillPlayer()
{
	//********************CHANGE LATER**********************\\
	SceneManager.LoadScene("Game Over");
}

private void DamagePlayer(float damage)
{
	hp -= damage;
	hpRegenTimer = 0f;
}

private void OnTriggerEnter(Collider other)
{
	//Damage code
	if (other.gameObject.tag == "Enemy Bullet")
	{
		attackScript = other.gameObject.GetComponent<EnemyAttacks>();

		DamagePlayer(attackScript.damageAmount);

		Destroy(other.gameObject);
	}
}

public void AddEnemyCount()
{
	enemiesKilled += 1;
	attackTarget = attackTarget / 100 * attackSpeedPerKill;
	bulletTarget = bulletTarget / 100 * attackSpeedPerKill;
	multiTarget = multiTarget / 100 * attackSpeedPerKill;
}
	`
},

{
	name: "GameManager.cs: Cheat Menu",
	language: "C#",
	description: "These are the functions for the cheat menu. It has a text input field that you can activate by pressing submit when paused. You can type in 'maxwell' to enable maxwell mode, which makes the player maxwell. You can also type in 'jeremy' to spawn jeremys.",
	code: `
private void Update()
{
	if (Input.GetButtonDown("Submit"))
	{
		if (isPaused)
		{
			activateInputField = !activateInputField;

			if (activateInputField)
			{
				inputField.SetActive(true);
			}
			else
			{
				inputField.SetActive(false);
			}
		}
	}
{
	
public void CheckInput(string s)
{
	input = inputField.GetComponent<TMP_InputField>().text;
	Debug.Log(input);

	if (input == "maxwell" || input == "Maxwell" || input == "MAXWELL" || input == "mawbell" || input == "Mawbell" || input == "MAWBELL")
	{
		maxwellMode = true;
	}

	if (input == "jeremy" || input == "Jeremy" || input == "JEREMY")
	{
		for (int i = 0; i < totalJeremys; i++)
		{
			Instantiate(jeremy);
		}
	}
}
	`
},

{
	name: "GameManager.cs: Level Progress Bar",
	language: "C#",
	description: "This is the function in charge of setting the right position for the player in the scrollbar. It's supposed to move closer to the boss until it spawns",
	code: `
private void ScrollbarLogics()
{
	float elapsedTime = Time.time - startTime;
	float normalizedTime = Mathf.Clamp01(elapsedTime / bossSpawnTarget);

	playerScrollbarVisual.transform.position = Vector3.Lerp(minDistancePlayerScrollbar.position, maxDistancePlayerScrollbar.position, normalizedTime);
}
	`
},
        ],
    },


  // Asteroids 3D //
  {
    title: "Asteroids 3D",
    slug: "asteroids-3d",
    banner: "/images/asteroids 3d.webp",
    icon: "/images/asteroids 3d.webp",

    date: "2024-03-01",
    displayDate: formatDisplayDate("2024-03-01"),

    href: "https://linkerpink.itch.io/asteroids-3d",
    github: "https://github.com/Linkerpink/Poker-Roguelike",

    imgSrc: "/images/asteroids 3d.webp",
    platform: "itch.io",

    description:
      "A 3D remake of Asteroids. \n\nWhat I made: \n- A tip system that shows a gameplay tip once in a while. \n- Screen wrapping system \n- Animated interactable main menu \n- GameManager / Round management \n- Player movement \n- Shooting \n- Asteroids",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/asteroids 3d.webp" }],

    featured: false,

    codeSnippets: [
      {
        name: "TipTextbox.cs",
        language: "C#",
        description: "The script for the tips. It shows a random tip from an array and then after a few seconds it disappears.",
        code: `
[SerializeField] private TextMeshProUGUI text;

private string[] tips = new string[]
{
    "Tip: Playing bloons td will f*ck up your life",
    "Tip: Blade ball... Yeah that's it.. Just don't touch blade ball",
    "Tip: Everything is legal, as long as they don't find out",
    "Tip: Move to move",
    "Tip: Shoot to shoot",
    "Tip: IT'S ALL JEREMY'S FAULT!!!!!",
    "Tip: If you want to keep your sanity, stop playing",
    "Tip: In the beginning, God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters. And God said, 'Let there be light,' and there was light. And God saw the light, that it was good; and God divided the light from the darkness. And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
    "Tip: Jeremy (the rubber duckie) has been tortured 37 times while writing this :)",
};

private float destroyTimer = 7f;
private Animator animator;
private RectTransform transform;


private void Awake()
{
    animator = GetComponent<Animator>();
    transform = GetComponent<RectTransform>();
}

void Start()
{
    int rnd = Random.Range(0, tips.Length);
    text.SetText(tips[rnd]);
    if (rnd == 7)
    {
        text.fontSize = 14;
    }else
    {
        text.fontSize = 38;
    }

    animator.SetBool("TransitionOut", false);
}

void Update()
{
    destroyTimer -= 1 * Time.deltaTime;

    
    if (destroyTimer < 0.5f)
    {
        animator.SetBool("TransitionOut", true);
    }

    if (destroyTimer <= 0.0f)
    {
        
    }
}
`,
      },

      {
          name: "Player.cs",
          language: "C#",
          description: "The script for the player.",
          code: `
private void Awake()
{
    transform = GetComponent<Transform>();
    rb = GetComponent<Rigidbody>();
    meshRenderer = GetComponentInChildren<MeshRenderer>();
    collider = GetComponentInChildren<BoxCollider>();
    mainCamera = Camera.main;
}

private void FixedUpdate()
{
    horizontal = Input.GetAxisRaw("Horizontal");
    vertical = Input.GetAxisRaw("Vertical");
    if (vertical <= 0)
    {
        vertical = 0;
    }

    if (horizontal < 0 || horizontal > 0 || vertical > 0)
    {
        invincible = false;
    }

    rb.AddTorque(transform.up * horizontal * torque);
    rb.AddRelativeForce(new Vector3(0, 0, vertical * torque * 2));
}

private void Update()
{
    if (bulletCoolDown > 0)
    {
        bulletCoolDown -= 1 * Time.deltaTime;
    }

    if (Input.GetButton("Jump"))
    {
        if (bulletCoolDown <= 0)
        {
            Instantiate(bullet, transform.position, transform.rotation);
            bulletCoolDown = maxBulletCoolDown;
        }
    }

    if (invincible)
    {
        collider.enabled = false;

        meshRendererTimer -= 1f * Time.deltaTime * 10;

        if (meshRendererTimer <= 0)
        {
            enableMeshRenderer = !enableMeshRenderer;
            meshRendererTimer = 1f;
        }

        if (enableMeshRenderer == true)
        {
            meshRenderer.enabled = true;
        }
        else
        {
            meshRenderer.enabled = false;
        }
    }
    else
    {
        meshRenderer.enabled = true;
        collider.enabled = true;
    }

    hpText.SetText("HP: " + hp.ToString());
}

private void OnCollisionEnter(Collision collision)
{
    if (collision.gameObject.tag == "Freddy" || collision.gameObject.tag == "Bonnie" || collision.gameObject.tag == "AmongUs")
    {
        if (!invincible)
        {
            if (hp > 0)
            {
                hp--;
                invincible = true;
                transform.position = Vector3.zero;
                transform.rotation = Quaternion.identity;
                rb.linearVelocity = Vector3.zero;
                rb.angularVelocity = Vector3.zero;

            }
            else
            {
                SceneManager.LoadScene("Game Over");
                Debug.Log("slecht");
            }
        }
    }
}
}
`,
        },

        {
          name: "ScreenWrap.cs",
          language: "C#",
          description: "The script for the screen wrapping. If the object the script is attached to goes out of the camera view, it will appear on the other side of the screen.",
          code: `
 private void Start()
{
    mainCamera = Camera.main;
    transform = GetComponent<Transform>();
}

private void Update()
{
    Vector3 screenPos = mainCamera.WorldToScreenPoint(transform.position);

    if (screenPos.x > Screen.width + extraSpace)
    {
        transform.position = mainCamera.ScreenToWorldPoint(new Vector3(0, screenPos.y, screenPos.z));
    }
    else if (screenPos.x < 0 - extraSpace)
    {
        transform.position = mainCamera.ScreenToWorldPoint(new Vector3(Screen.width, screenPos.y, screenPos.z));
    }
    if (screenPos.y > Screen.height + extraSpace)
    {
        transform.position = mainCamera.ScreenToWorldPoint(new Vector3(screenPos.x, 0, screenPos.z));
    }
    else if (screenPos.y < 0 - extraSpace)
    {
        transform.position = mainCamera.ScreenToWorldPoint(new Vector3(screenPos.x, Screen.height, screenPos.z));
    }
}

`,
        },

        {
          name: "GameManager.cs",
          language: "C#",
          description: "The script for the round management and game management.",
          code: `
void Start()
{
    StartNewRound();
}

void Update()
{
    textboxTimer -= 1 * Time.deltaTime;

    if (textboxTimer <= 0)
    {
        Instantiate(textBox);
        textboxTimer = 20;
    }

    scoreText.text = score.ToString();

    roundTimer -= 1 * Time.deltaTime;

    if (roundTimer <= 0)
    {
        asteroidsToSpawn = Random.Range(1, 5);
        StartNewRound();
        Debug.Log("New round started");
        roundTimer = 15f;
    }

    
    if (Input.GetKeyDown(KeyCode.RightShift))
    {
        roundTimer = 0;
    }

    if (Input.GetKeyDown(KeyCode.KeypadEnter))
    {
        Instantiate(textBox);
    }
    

    //Debug.Log(activeAsteroids);
}

private void StartNewRound()
{
    // Reset the active asteroids count
    activeAsteroids = (int)asteroidsToSpawn;

    for (int i = 0; i < asteroidsToSpawn; i++)
    {
        int rnd = Random.Range(0, 3);
        int x = Random.Range(-10, 10);
        int y = Random.Range(-10, 10);
        var pos = new Vector3(x, 0, y);
        Instantiate(gameObjects[rnd], pos, Quaternion.identity);
    }
}
public void ReportAsteroidDestroyed()
{
    activeAsteroids--;
}
`,
        },

        {
          name: "SineWaveAnimation.cs",
          language: "C#",
          description: "The script for the interactable animated main menu.",
          code: `
private void Start()
{
    rectTransform = GetComponent<RectTransform>();
    textMeshProComponent = GetComponentInChildren<TextMeshProUGUI>();

    originalSize = rectTransform.sizeDelta;
    originalPivot = rectTransform.pivot;
    originalFontSize = textMeshProComponent.fontSize;

    rectTransform.pivot = new Vector2(0.5f, 0.5f);
}

private void FixedUpdate()
{
    float deltaTime = Time.fixedDeltaTime;

    float targetY = Mathf.Sin(Time.time * speed * frequency) * amplitude;
    float y = Mathf.SmoothDamp(rectTransform.anchoredPosition.y, targetY, ref velocity.y, 0.1f);

    rectTransform.anchoredPosition = new Vector2(rectTransform.anchoredPosition.x, y);

    float rotationAngle = Mathf.Sin(Time.time * rotationSpeed) * rotationAmplitude;
    rectTransform.rotation = Quaternion.Euler(0f, 0f, rotationAngle);
}

public void OnPointerEnter(PointerEventData eventData)
{
    StartCoroutine(LerpSize(originalSize * 1.1f, sizeChangeDuration));
    StartCoroutine(LerpFontSize(originalFontSize * 1.1f, fontSizeChangeDuration));
}

public void OnPointerExit(PointerEventData eventData)
{
    StartCoroutine(LerpSize(originalSize, sizeChangeDuration));
    StartCoroutine(LerpFontSize(originalFontSize, fontSizeChangeDuration));
}

private IEnumerator LerpSize(Vector2 targetSize, float duration)
{
    float elapsedTime = 0f;
    Vector2 startSize = rectTransform.sizeDelta;

    while (elapsedTime < duration)
    {
        rectTransform.sizeDelta = Vector2.Lerp(startSize, targetSize, elapsedTime / duration);
        elapsedTime += Time.deltaTime;
        yield return null;
    }

    rectTransform.sizeDelta = targetSize;
}

private IEnumerator LerpFontSize(float targetFontSize, float duration)
{
    float elapsedTime = 0f;
    float startFontSize = textMeshProComponent.fontSize;

    while (elapsedTime < duration)
    {
        textMeshProComponent.fontSize = Mathf.Lerp(startFontSize, targetFontSize, elapsedTime / duration);
        elapsedTime += Time.deltaTime;
        yield return null;
    }

    textMeshProComponent.fontSize = targetFontSize;
}
`,
        },
    ],
  },
    
    // Not Not Balatro (even more traumatic flashbacks) //
    {
      title: "Not Not Balatro",
      slug: "not-not-balatro",
      banner: "/images/not not balatro banner.webp",
      icon: "/images/not not balatro icon.webp",
  
      date: "2025-01-27",
      displayDate: formatDisplayDate("2025-01-27"),
  
      href: "https://linkerpink.itch.io/not-not-balatro",
      github: "https://github.com/Linkerpink/Poker-Roguelike",
  
      imgSrc: "/images/not not balatro.webp",
      platform: "itch.io",
  
      description:
        "Not Not Balatro is an attempt at recreating the core gameplay loop of balatro for a school project. \n\nWhat I made: \n- Deck system \n- Hand system \n- Round system \n- Card selection system \n- Hand checking system",
  
      technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],
  
      media: [{ type: "image", src: "/images/not not balatro.webp" }],
  
      featured: false,
  
      codeSnippets: [
        {
          name: "Deck.cs",
          language: "C#",
          description: "The script for the deck, hand and round managing.",
          code: `
private void Start()
{
    deathScreen.SetActive(false);
    StartRound();
}

private void Update()
{
    roundScoreQuotaText.SetText("Round score quota: " + m_gameManager.roundScoreQuota.ToString());
}

private void StartRound()
{
    InitializeCardPositions();
    SetCards();
    StartCoroutine(DrawCardsToHand(8));

    m_gameManager.round += 1;
    m_gameManager.roundScore = 0;
    m_gameManager.roundScoreQuota *= 1.25f;
}

private void InitializeCardPositions()
{
    m_positionTaken = new bool[m_cardPositions.Length];
}

private PlayingCardSO ChooseRandomCard()
{
    if (m_remainingDeckCards.Count > 0)
    {
        PlayingCardSO _card = m_remainingDeckCards[Random.Range(0, m_remainingDeckCards.Count)];
        handList.Add(_card);
        m_remainingDeckCards.Remove(_card);

        m_deckText.SetText(m_remainingDeckCards.Count.ToString() + " / " + m_playingCardSOList.Count.ToString());

        return _card;
    }
    return null;
}

private void AddCardToHand()
{
    int positionIndex = FindAvailablePosition();
    if (positionIndex == -1)
    {
        Debug.LogError("No available positions for new card!");
        return;
    }

    PlayingCardSO _cardSO = ChooseRandomCard();
    if (_cardSO == null) return;

    GameObject _playingCard = Instantiate(m_playingCardPrefab, m_cardPositions[positionIndex].position, Quaternion.identity, m_cardPositions[positionIndex]);
    _playingCard.GetComponent<PlayingCard>().SetCardValues(_cardSO, positionIndex);

    m_positionTaken[positionIndex] = true;
}

private int FindAvailablePosition()
{
    for (int i = 0; i < m_positionTaken.Length; i++)
    {
        if (!m_positionTaken[i]) return i;
    }
    return -1;
}

public void SetCards()
{
    m_remainingDeckCards = new List<PlayingCardSO>(m_playingCardSOList);

    
    m_deckText.SetText(m_remainingDeckCards.Count.ToString() + " / " + m_playingCardSOList.Count.ToString());
}

public void SelectCard(PlayingCardSO _card)
{
    selectedCards.Add(_card);
}

public void DeselectCard(PlayingCardSO _card)
{
    selectedCards.Remove(_card);
}

private IEnumerator DrawCardsToHand(int _cardAmount)
{
    for (int i = 0; i < _cardAmount; i++)
    {
        AddCardToHand();
        yield return new WaitForSeconds(cardDrawTime);
    }
}

public void RemoveCardFromPosition(int positionIndex)
{
    if (positionIndex >= 0 && positionIndex < m_positionTaken.Length)
    {
        m_positionTaken[positionIndex] = false;
    }
}

public void ResetDeck()
{
    // Clear all cards from the positions
    foreach (Transform cardPosition in m_cardPositions)
    {
        foreach (Transform child in cardPosition)
        {
            Destroy(child.gameObject); // Destroy child card objects
        }
    }

    // Clear card lists
    selectedCards.Clear();
    handList.Clear();

    // Reset all position states
    InitializeCardPositions();

    // Reset the deck
    SetCards();

    // Draw a new set of cards
    StartCoroutine(DrawCardsToHand(8));
}

public void StartHandCheck()
{
    if (m_gameManager.gameState == GameManager.GameStates.Game)
    {
        StartCoroutine(HandCheck());
    }
}

public IEnumerator HandCheck()
{
    foreach (PlayingCardSO _card in selectedCards)
    {
        m_gameManager.roundScore += _card.cardValue;
        yield return new WaitForSeconds(0.25f);
    }
    yield return new WaitForSeconds(1);
    
    if (m_gameManager.roundScore < m_gameManager.roundScoreQuota)
    {
        deathScreen.SetActive(true);
    }

    m_gameManager.gameState = GameManager.GameStates.Shop;
}`,
        },

         {
          name: "Card.cs",
          language: "C#",
          description: "The script for the card object.",
          code: `
private void Awake()
{
    m_gameManager = FindObjectOfType<GameManager>();

    m_initialPosition = transform.position;

    m_deck = FindObjectOfType<Deck>();

    m_hand = GameObject.Find("Hand");

    if (m_hand != null)
    {
        foreach (Transform _child in m_hand.transform)
        {
            int m_handCount = m_deck.handList.Count;

            switch (m_handCount)
            {
                case 0:
                break;

                case 1:
                transform.SetParent(m_hand.transform);
                break;
                
            }
        }
    }
}

private void Update()
{
    Vector3 _p = transform.position;

    if (m_selected)
    {
        _p.y = Mathf.Lerp(_p.y, m_initialPosition.y + 1, m_smoothTime);
    }
    else
    {
        _p.y = Mathf.Lerp(_p.y, m_initialPosition.y, m_smoothTime);
    }

    transform.position = new Vector3(transform.position.x, _p.y, 0);

    if (Input.GetMouseButtonDown(0) && m_mouseOver && !m_gameManager.isDragging)
    {
        m_initialMousePos = Input.mousePosition; // Mouse position
    }

    if (Input.GetMouseButton(0) && m_mouseOver && !m_gameManager.isDragging && m_dragable)
    {
        if (m_initialMousePos != Input.mousePosition)
        {
            m_dragging = true;
            m_gameManager.ChangeDragging(true);
        }
    }

    if (Input.GetMouseButtonUp(0))
    {
        m_dragging = false;
        m_gameManager.ChangeDragging(false);
        
        if (m_selectable && m_mouseOver)
        {
            if (!m_selected && m_deck.selectedCards.Count < 5)
            {
                m_selected = true;

                PlayingCardSO _card;
                _card = GetComponent<PlayingCard>().playingCardSO;

                if (_card != null)
                {
                    m_deck.SelectCard(_card);
                }
            }
            else
            {
                m_selected = false;

                PlayingCardSO _card;
                _card = GetComponent<PlayingCard>().playingCardSO;

                if (_card != null)
                {
                    m_deck.DeselectCard(_card);
                }
            }
        }
    }

    if (m_dragging)
    {
        Vector3 _mousePos;
        Camera _cam = Camera.main;

        _mousePos.x = Input.mousePosition.x;
        _mousePos.y = Input.mousePosition.y;

        Vector3 _point;

        _point = _cam.ScreenToWorldPoint(new Vector3(_mousePos.x, _mousePos.y, 0));

        transform.position = Vector3.Lerp(transform.position, _point, m_smoothTime);
    }
    else
    {
        transform.position = Vector3.Lerp(transform.position, m_initialPosition, m_smoothTime);
    }
}

public void OnPointerEnter(PointerEventData _eventData)
{
    m_mouseOver = true;
}

public void OnPointerExit(PointerEventData _eventData)
{
    m_mouseOver = false;
}
`,
        },

        {
          name: "PlayingCard.cs",
          language: "C#",
          description: "The script for the visual of the card. it sets the suit sprites and text and color.",
          code: `
public void SetCardValues(PlayingCardSO _playingCardSO, int positionIndex)
{
    playingCardSO = _playingCardSO;
    CardPositionIndex = positionIndex; // Assign the position index

    foreach (TextMeshProUGUI _text in m_cardTexts)
    {
        _text.SetText(playingCardSO.cardText);
        _text.color = playingCardSO.cardColor;
    }

    foreach (Image _icon in m_cardIcons)
    {
        _icon.sprite = playingCardSO.cardIcon;
        _icon.color = playingCardSO.cardColor;
    }

    GameObject _cardDesign = Instantiate(playingCardSO.cardDesign, m_cardDesignParent.transform);

    foreach (Transform _child in _cardDesign.transform)
    {
        if (_child.gameObject.name == "Card Design Canvas")
        {
            Transform _cardDesignCanvas = _child.GetComponent<Transform>();

            foreach (Transform _c in _cardDesignCanvas.transform)
            {
                Image _icon = _c.gameObject.GetComponent<Image>();

                _icon.sprite = playingCardSO.cardIcon;
                _icon.color = playingCardSO.cardColor;
            }
        }
    }
}
}
`,
        },

        {
          name: "GameManager.cs",
          language: "C#",
          description: "The GameManager script.",
          code: `
public static GameManager Instance
{
    get
    {
        if (instance == null)
        {
            instance = FindObjectOfType<GameManager>();

            if (instance == null)
            {
                GameObject gameManagerObj = new GameObject("GameManager");
                instance = gameManagerObj.AddComponent<GameManager>();
            }
        }
        return instance;
    }
}

private void Awake()
{
    if (instance != null && instance != this)
    {
        Destroy(gameObject);
    }
    else
    {
        instance = this;
        DontDestroyOnLoad(gameObject);
    }
}

private void OnEnable()
{
    SceneManager.sceneLoaded += OnSceneLoaded;
}

private void OnDisable()
{
    SceneManager.sceneLoaded -= OnSceneLoaded;
}

private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{
    if (scene.name == "Main")
    {
        gameState = GameStates.Game;
        m_shop = GameObject.Find("Shop");
        m_deck = FindObjectOfType<Deck>();
        m_roundScoreText = GameObject.Find("Round Score Text")?.GetComponent<TextMeshProUGUI>();

        if (m_shop == null || m_roundScoreText == null)
        {
            Debug.LogWarning("Shop or Round Score Text not found in the Main scene.");
        }
    }
}

private void Update()
{
    if (m_roundScoreText != null)
    {
        m_roundScoreText.SetText(roundScore.ToString("F2"));
    }

    switch (gameState)
    {
        case GameStates.MainMenu:
            break;

        case GameStates.Game:
            if (m_shop != null)
            {
                m_shop.SetActive(false);
            }
            break;

        case GameStates.Shop:
            if (m_shop != null)
            {
                m_shop.SetActive(true);
            }
            break;

        case GameStates.Paused:
            break;

        default:
            break;
    }
}

public void ChangeDragging(bool _dragging)
{
    isDragging = _dragging;
}

public void ChangeScene(string _scene)
{
    SceneManager.LoadScene(_scene);
}

public void ChangeGameState(string _state)
{
    //used chatgpt for the type switching
    if (Enum.TryParse(_state, true, out GameStates newState))
    {
        gameState = newState;
        if (newState == GameStates.Game)
        {
            //Reset cards and stuff
            roundScore = 0;
            roundScoreQuota += 10;
            m_deck.ResetDeck();
        }

        Debug.Log("Game state changed to: " + gameState);
    }
    else
    {
        Debug.LogError("Invalid game state: " + _state);
    }
}
}
`,
        },
      ],
    },
].map((project) => ({
  ...project,
  slug: generateSlug(project.title),
}));

// Optional: sortProjects helper
export function sortProjects(projects: typeof allProjects, newestFirst = true) {
  return [...projects].sort((a, b) => {
    const aNotReleased = a.date.toLowerCase() === "not released";
    const bNotReleased = b.date.toLowerCase() === "not released";

    if (aNotReleased && bNotReleased) return 0;
    if (aNotReleased) return 1;
    if (bNotReleased) return -1;

    if (newestFirst) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
}
