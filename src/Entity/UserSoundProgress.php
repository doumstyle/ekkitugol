<?php

namespace App\Entity;

use App\Repository\UserSoundProgressRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserSoundProgressRepository::class)]
class UserSoundProgress
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userSoundProgress')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userSoundProgress')]
    private ?Sounds $sound = null;

    #[ORM\Column]
    private ?int $progress = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSound(): ?Sounds
    {
        return $this->sound;
    }

    public function setSound(?Sounds $sound): static
    {
        $this->sound = $sound;

        return $this;
    }

    public function getProgress(): ?int
    {
        return $this->progress;
    }

    public function setProgress(int $progress): static
    {
        $this->progress = max(0, min(100, $progress));

        return $this;
    }
}
