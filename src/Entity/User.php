<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'Il y a déjà un compte avec cet email !')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    private ?string $lastname = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Profile $profile = null;

    /**
     * @var Collection<int, UserSoundProgress>
     */
    #[ORM\OneToMany(targetEntity: UserSoundProgress::class, mappedBy: 'user')]
    private Collection $userSoundProgress;

    /**
     * @var Collection<int, UserWordProgress>
     */
    #[ORM\OneToMany(targetEntity: UserWordProgress::class, mappedBy: 'user')]
    private Collection $userWordProgress;

    public function __construct()
    {
        $this->userSoundProgress = new ArrayCollection();
        $this->userWordProgress = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(Profile $profile): static
    {
        // set the owning side of the relation if necessary
        if ($profile->getUser() !== $this) {
            $profile->setUser($this);
        }

        $this->profile = $profile;

        return $this;
    }

    /**
     * @return Collection<int, UserSoundProgress>
     */
    public function getUserSoundProgress(): Collection
    {
        return $this->userSoundProgress;
    }

    public function addUserSoundProgress(UserSoundProgress $userSoundProgress): static
    {
        if (!$this->userSoundProgress->contains($userSoundProgress)) {
            $this->userSoundProgress->add($userSoundProgress);
            $userSoundProgress->setUser($this);
        }

        return $this;
    }

    public function removeUserSoundProgress(UserSoundProgress $userSoundProgress): static
    {
        if ($this->userSoundProgress->removeElement($userSoundProgress)) {
            // set the owning side to null (unless already changed)
            if ($userSoundProgress->getUser() === $this) {
                $userSoundProgress->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserWordProgress>
     */
    public function getUserWordProgress(): Collection
    {
        return $this->userWordProgress;
    }

    public function addUserWordProgress(UserWordProgress $userWordProgress): static
    {
        if (!$this->userWordProgress->contains($userWordProgress)) {
            $this->userWordProgress->add($userWordProgress);
            $userWordProgress->setUser($this);
        }

        return $this;
    }

    public function removeUserWordProgress(UserWordProgress $userWordProgress): static
    {
        if ($this->userWordProgress->removeElement($userWordProgress)) {
            // set the owning side to null (unless already changed)
            if ($userWordProgress->getUser() === $this) {
                $userWordProgress->setUser(null);
            }
        }

        return $this;
    }
}
