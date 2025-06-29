<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\SoundsRepository;


#[ORM\Entity(repositoryClass: SoundsRepository::class)]
class Sounds
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $letter = null;

    #[ORM\Column(length: 255)]
    private ?string $example = null;

    #[ORM\Column(length: 255)]
    private ?string $audio = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    /**
     * @var Collection<int, UserSoundProgress>
     */
    #[ORM\OneToMany(targetEntity: UserSoundProgress::class, mappedBy: 'sound')]
    private Collection $userSoundProgress;

    #[ORM\Column(length: 255)]
    private ?string $translation = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->userSoundProgress = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLetter(): ?string
    {
        return $this->letter;
    }

    public function setLetter(string $letter): static
    {
        $this->letter = $letter;

        return $this;
    }

    public function getExample(): ?string
    {
        return $this->example;
    }

    public function setExample(string $example): static
    {
        $this->example = $example;

        return $this;
    }

    public function getAudio(): ?string
    {
        return $this->audio;
    }

    public function setAudio(string $audio): static
    {
        $this->audio = $audio;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue()
    {
        $this->updatedAt = new DateTimeImmutable();
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

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
            $userSoundProgress->setSound($this);
        }

        return $this;
    }

    public function removeUserSoundProgress(UserSoundProgress $userSoundProgress): static
    {
        if ($this->userSoundProgress->removeElement($userSoundProgress)) {
            // set the owning side to null (unless already changed)
            if ($userSoundProgress->getSound() === $this) {
                $userSoundProgress->setSound(null);
            }
        }

        return $this;
    }

    public function getTranslation(): ?string
    {
        return $this->translation;
    }

    public function setTranslation(string $translation): static
    {
        $this->translation = $translation;

        return $this;
    }
}
